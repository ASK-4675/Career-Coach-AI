import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  initialStudentProfile,
  engineeringDepartments,
  careerRoles,
  checkCrossDisciplinary,
  dashboardOverview,
  questionBankData,
  skillGapData,
  learningRoadmapData,
  weeklyReportData
} from "../data/demoData";
import {
  authApi,
  profileApi,
  referenceApi,
  dashboardApi,
  roadmapApi,
  weeklyReportApi
} from "../services/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Session & Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(true);

  // Student profile state
  const [student, setStudent] = useState(() => {
    const saved = localStorage.getItem("careercoach_student_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return initialStudentProfile;
  });

  const [selectedDeptId, setSelectedDeptId] = useState(() => {
    return localStorage.getItem("careercoach_dept_v2") || student.departmentId || "cse";
  });

  const [selectedRoleId, setSelectedRoleId] = useState(() => {
    return localStorage.getItem("careercoach_role_v2") || student.targetRoleId || "full-stack-developer";
  });

  const [roadmap, setRoadmap] = useState(() => {
    const saved = localStorage.getItem("careercoach_roadmap_v2");
    return saved ? JSON.parse(saved) : learningRoadmapData;
  });

  const [mockInterviews, setMockInterviews] = useState(dashboardOverview.recentFeedback);

  const [notifications, setNotifications] = useState([
    {
      id: "notif_1",
      title: "Upcoming Mock Interview",
      message: "Round 2 Technical Mock starts tomorrow at 4:30 PM.",
      time: "10m ago",
      unread: true
    },
    {
      id: "notif_2",
      title: "Cross-Disciplinary Pathway Activated",
      message: "Personalized preparation modules calibrated for your target role.",
      time: "1h ago",
      unread: true
    },
    {
      id: "notif_3",
      title: "Weekly Roadmap Update",
      message: "You completed 28 of 35 milestones. Keep the streak going!",
      time: "2h ago",
      unread: true
    }
  ]);
  const [weeklyReport, setWeeklyReport] = useState(weeklyReportData);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Convert backend DB profile into the frontend student structure
  const applyDbProfile = useCallback((prof, userEmail) => {
    if (!prof) return;
    setStudent((prev) => ({
      ...prev,
      name: prof.full_name || prev.name,
      email: userEmail || prof.email || prev.email,
      college: prof.college || prev.college,
      degree: prof.degree || prev.degree,
      department: prof.department_name || prev.department,
      departmentId: prof.department_id || prev.departmentId,
      currentYear: prof.current_year ? `${prof.current_year}th Year` : prev.currentYear,
      graduationYear: prof.graduation_year ? String(prof.graduation_year) : prev.graduationYear,
      targetRole: prof.target_role_name || prev.targetRole,
      targetRoleId: prof.target_role_id || prev.targetRoleId,
      difficultyLevel: prof.difficulty_level
        ? prof.difficulty_level.charAt(0).toUpperCase() + prof.difficulty_level.slice(1)
        : prev.difficultyLevel,
      skills: Array.isArray(prof.skills) && prof.skills.length > 0 ? prof.skills : prev.skills,
      bio: prof.bio || prev.bio,
      github: prof.github_url || prev.github,
      linkedin: prof.linkedin_url || prev.linkedin,
      avatar: prof.avatar_initials || prev.avatar
    }));

    if (prof.department_id) setSelectedDeptId(prof.department_id);
    if (prof.target_role_id) setSelectedRoleId(prof.target_role_id);
  }, []);

  // Check auth session on startup
  // Load weekly report from backend when authenticated
  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        try {
          const data = await weeklyReportApi.getSummary();
          setWeeklyReport(data);
        } catch (e) {
          console.warn("Failed to fetch weekly report:", e);
        }
      })();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await authApi.me();
        if (isMounted && res && res.user) {
          setCurrentUser(res.user);
          setIsLoggedIn(true);
          setBackendConnected(true);

          // Fetch full profile from SQLite database
          try {
            const profData = await profileApi.get();
            if (isMounted && profData && profData.profile) {
              applyDbProfile(profData.profile, res.user.email);
            }
          } catch (e) {
            console.warn("Could not load backend profile:", e);
          }
        }
      } catch (err) {
        if (isMounted) {
          setIsLoggedIn(false);
          setCurrentUser(null);
          // If 401, backend is reachable but no active session
          if (err.status === 401) {
            setBackendConnected(true);
          } else {
            console.warn("Backend auth check error:", err.message);
          }
        }
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [applyDbProfile]);

  // Sync state to localStorage for offline cache
  useEffect(() => {
    localStorage.setItem("careercoach_student_v2", JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem("careercoach_dept_v2", selectedDeptId);
  }, [selectedDeptId]);

  useEffect(() => {
    localStorage.setItem("careercoach_role_v2", selectedRoleId);
  }, [selectedRoleId]);

  useEffect(() => {
    localStorage.setItem("careercoach_roadmap_v2", JSON.stringify(roadmap));
  }, [roadmap]);

  // Validation function for student profile
  const validateStudentProfile = (data) => {
    const errors = [];
    if (!data.name || !data.name.trim()) errors.push("Full Name is required.");
    if (!data.college || !data.college.trim()) errors.push("College / Institute Name is required.");
    if (!data.degree || !data.degree.trim()) errors.push("Degree program is required.");
    if (!data.department || !data.department.trim()) errors.push("Department is required.");
    if (!data.currentYear) errors.push("Current Year of study is required.");
    if (!data.graduationYear) errors.push("Graduation Year is required.");
    if (!data.targetRole) errors.push("Target Career Role is required.");
    if (!data.skills || data.skills.length === 0) errors.push("At least one skill must be specified.");
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Auth actions
  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    setCurrentUser(res.user);
    setIsLoggedIn(true);

    // Fetch and apply profile
    try {
      const profData = await profileApi.get();
      if (profData && profData.profile) {
        applyDbProfile(profData.profile, res.user.email);
      }
    } catch (e) {
      console.warn("Could not load backend profile after login:", e);
    }
    return res;
  };

  const register = async (payload) => {
    const res = await authApi.register(payload);
    setCurrentUser(res.user);
    setIsLoggedIn(true);

    try {
      const profData = await profileApi.get();
      if (profData && profData.profile) {
        applyDbProfile(profData.profile, res.user.email);
      }
    } catch (e) {
      console.warn("Could not load backend profile after register:", e);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setCurrentUser(null);
    setIsLoggedIn(false);
    showToast("Signed out securely.");
  };

  const updateStudentProfile = async (updates) => {
    setStudent((prev) => {
      const updated = { ...prev, ...updates };
      if (updates.departmentId) setSelectedDeptId(updates.departmentId);
      if (updates.targetRoleId) setSelectedRoleId(updates.targetRoleId);
      return updated;
    });

    // Sync to SQLite database asynchronously
    try {
      const yearNum = updates.currentYear ? parseInt(String(updates.currentYear), 10) : null;
      const gradYearNum = updates.graduationYear ? parseInt(String(updates.graduationYear), 10) : null;
      let diff = updates.difficultyLevel ? updates.difficultyLevel.toLowerCase() : "medium";
      if (!["easy", "medium", "hard"].includes(diff)) diff = "medium";

      await profileApi.update({
        full_name: updates.name,
        college: updates.college,
        degree: updates.degree,
        department_id: updates.departmentId,
        department_name: updates.department,
        current_year: !isNaN(yearNum) ? yearNum : null,
        graduation_year: !isNaN(gradYearNum) ? gradYearNum : null,
        skills: updates.skills || [],
        target_role_id: updates.targetRoleId,
        target_role_name: updates.targetRole,
        difficulty_level: diff,
        bio: updates.bio,
        linkedin_url: updates.linkedin,
        github_url: updates.github
      });
    } catch (err) {
      console.warn("Background profile sync error:", err.message);
    }

    showToast("Profile personalization saved successfully!");
  };

  const selectDepartment = async (deptId) => {
    setSelectedDeptId(deptId);
    const dept = engineeringDepartments.find((d) => d.id === deptId);
    if (dept) {
      setStudent((prev) => ({
        ...prev,
        departmentId: dept.id,
        department: dept.name
      }));
      showToast(`Selected Department: ${dept.name}`);

      // Sync to backend if authenticated
      if (isLoggedIn) {
        try {
          await profileApi.setDepartment(dept.id, dept.name);
        } catch (e) {
          console.warn("Could not sync department to backend:", e);
        }
      }
    }
  };

  const selectRole = async (roleId) => {
    setSelectedRoleId(roleId);
    const role = careerRoles.find((r) => r.id === roleId);
    if (role) {
      setStudent((prev) => ({
        ...prev,
        targetRoleId: role.id,
        targetRole: role.title
      }));
      const { isCross } = checkCrossDisciplinary(selectedDeptId, role.id);
      if (isCross) {
        showToast(`Selected ${role.title} (Cross-Disciplinary Pathway active)`);
      } else {
        showToast(`Target Career Role set to: ${role.title}`);
      }

      // Sync to backend if authenticated
      if (isLoggedIn) {
        try {
          await profileApi.setRole(role.id, role.title);
        } catch (e) {
          console.warn("Could not sync role to backend:", e);
        }
      }
    }
  };

  const toggleTask = (weekIndex, taskId) => {
    setRoadmap((prev) => {
      const updated = [...prev];
      const week = { ...updated[weekIndex] };
      week.tasks = week.tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      );
      const allDone = week.tasks.every((t) => t.done);
      const someDone = week.tasks.some((t) => t.done);
      if (allDone) week.status = "Completed";
      else if (someDone) week.status = "In Progress";
      else week.status = "To Do";

      updated[weekIndex] = week;
      return updated;
    });
    showToast("Roadmap progress updated!");
  };

  const addMockInterviewFeedback = (interviewResult) => {
    setMockInterviews((prev) => [interviewResult, ...prev]);
    showToast("Interview completed & feedback analyzed!");
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Find active department and role objects
  const currentDepartment =
    engineeringDepartments.find((d) => d.id === selectedDeptId) || engineeringDepartments[0];

  const currentRole =
    careerRoles.find((r) => r.id === selectedRoleId) || careerRoles[0];

  // Cross-disciplinary status
  const crossDisciplinaryInfo = checkCrossDisciplinary(selectedDeptId, selectedRoleId);

  // Suggested roles for current department
  const departmentSuggestedRoles = careerRoles.filter((r) =>
    r.recommendedDepts.includes(selectedDeptId)
  );

  // Cross-disciplinary roles outside current department
  const crossDisciplinaryRoles = careerRoles.filter(
    (r) => !r.recommendedDepts.includes(selectedDeptId)
  );

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        setIsLoggedIn,
        authLoading,
        backendConnected,
        login,
        register,
        logout,
        student,
        updateStudentProfile,
        validateStudentProfile,
        departments: engineeringDepartments,
        selectedDeptId,
        currentDepartment,
        selectDepartment,
        careerRoles,
        selectedRoleId,
        currentRole,
        selectRole,
        crossDisciplinaryInfo,
        departmentSuggestedRoles,
        crossDisciplinaryRoles,
        roadmap,
        toggleTask,
        mockInterviews,
        addMockInterviewFeedback,
        notifications,
        markNotificationsAsRead,
        toast,
        showToast,
        dashboardOverview,
        questionBankData,
        skillGapData,
        weeklyReport
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
