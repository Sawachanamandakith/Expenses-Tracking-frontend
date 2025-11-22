import React, { useState, useEffect } from "react";
import { Progress, Button, Input, message, Spin, Select, Card, Row, Col } from "antd";
import { MdAddCircle, MdEdit, MdDelete } from "react-icons/md";
import {
  getAllFinancialGoals,
  addFinancialGoal,
  updateFinancialGoal,
} from "../Services/FinancialGoalServices";

const { Option } = Select;

// ✅ Fixed Date Parsing
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d)) return "N/A";
  return d.toISOString().split("T")[0];
};

const PlanningPage = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ 
    name: "", 
    target: "", 
    date: "", 
    initialProgress: "0" 
  });
  const [editingGoal, setEditingGoal] = useState(null);
  const [progressUpdate, setProgressUpdate] = useState({});
  const [loading, setLoading] = useState(false);
  
  // In real app, get this from authentication context
  const currentUserId = 1; // Replace with actual user ID from your auth system

  // ✅ Fetch all goals
  const fetchGoals = async () => {
    setLoading(true);
    try {
      const data = await getAllFinancialGoals(currentUserId);
      const goalsArray = Array.isArray(data?.ResultSet)
        ? data.ResultSet.map((g) => ({
            goalID: g.GoalID,
            userID: g.UserID,
            goalName: g.GoalName?.trim(),
            targetAmount: g.TargetAmount,
            currentProgress: g.CurrentProgress || 0,
            progressPercent: g.ProgressPercent || 0,
            targetDate: formatDate(g.TargetDate),
            status: g.Status || 'A',
            createdAt: formatDate(g.CreatedAt),
            updatedAt: formatDate(g.UpdatedAt),
          }))
        : [];
      setGoals(goalsArray);
    } catch (error) {
      console.error("Error loading goals:", error);
      message.error("Failed to load financial goals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // ✅ Add New Goal
  const handleAddGoal = async () => {
    if (!newGoal.name || !newGoal.target || !newGoal.date) {
      message.warning("Please fill all required fields.");
      return;
    }

    try {
      const goalData = {
        UserID: currentUserId, // ✅ Added UserID
        GoalName: newGoal.name.trim(),
        TargetAmount: parseFloat(newGoal.target),
        CurrentProgress: parseFloat(newGoal.initialProgress) || 0, // ✅ Added CurrentProgress
        TargetDate: newGoal.date,
        Status: 'A' // ✅ Added Status
      };

      await addFinancialGoal(goalData);
      message.success("Financial goal added successfully!");
      setNewGoal({ name: "", target: "", date: "", initialProgress: "0" });
      fetchGoals();
    } catch (error) {
      console.error("Error adding goal:", error);
      message.error("Failed to add financial goal.");
    }
  };

  // ✅ Update Goal Progress
  const handleUpdateProgress = async (goalId) => {
    const newProgress = parseFloat(progressUpdate[goalId]) || 0;
    
    try {
      const goal = goals.find(g => g.goalID === goalId);
      const updatedGoal = {
        GoalID: goalId,
        UserID: goal.userID,
        GoalName: goal.goalName,
        TargetAmount: goal.targetAmount,
        CurrentProgress: newProgress,
        TargetDate: goal.targetDate,
        Status: goal.status
      };

      await updateFinancialGoal(updatedGoal);
      message.success("Progress updated successfully!");
      setProgressUpdate({ ...progressUpdate, [goalId]: "" });
      fetchGoals();
    } catch (error) {
      console.error("Error updating progress:", error);
      message.error("Failed to update progress.");
    }
  };

  // ✅ Mark Goal as Complete
  const handleCompleteGoal = async (goal) => {
    try {
      const updatedGoal = {
        GoalID: goal.goalID,
        UserID: goal.userID,
        GoalName: goal.goalName,
        TargetAmount: goal.targetAmount,
        CurrentProgress: goal.targetAmount, // Set to target amount
        TargetDate: goal.targetDate,
        Status: goal.status
      };

      await updateFinancialGoal(updatedGoal);
      message.success("Goal marked as completed!");
      fetchGoals();
    } catch (error) {
      console.error("Error completing goal:", error);
      message.error("Failed to complete goal.");
    }
  };

  // ✅ Update Goal Status
  const handleUpdateStatus = async (goalId, newStatus) => {
    try {
      const goal = goals.find(g => g.goalID === goalId);
      const updatedGoal = {
        GoalID: goalId,
        UserID: goal.userID,
        GoalName: goal.goalName,
        TargetAmount: goal.targetAmount,
        CurrentProgress: goal.currentProgress,
        TargetDate: goal.targetDate,
        Status: newStatus
      };

      await updateFinancialGoal(updatedGoal);
      message.success("Status updated successfully!");
      fetchGoals();
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Failed to update status.");
    }
  };

  // ✅ Calculate days remaining
  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
          ✨ Financial Planning & Goals
        </h1>
        <p className="text-gray-600 text-lg">Turn your financial dreams into achievable targets</p>
      </div>

      {/* Add New Goal Card */}
      <Card 
        title={
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="p-2 bg-blue-100 rounded-full">
              <MdAddCircle className="text-blue-600 text-xl" />
            </div>
            Add New Financial Goal
          </div>
        } 
        className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl"
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6}>
            <Input
              placeholder="🎯 Goal Name"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              size="large"
              className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 shadow-sm"
            />
          </Col>
          <Col xs={24} sm={4}>
            <Input
              placeholder="Target Amount"
              type="number"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              prefix="Rs."
              size="large"
              className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 shadow-sm"
            />
          </Col>
          <Col xs={24} sm={4}>
            <Input
              placeholder="Initial Progress"
              type="number"
              value={newGoal.initialProgress}
              onChange={(e) => setNewGoal({ ...newGoal, initialProgress: e.target.value })}
              prefix="Rs."
              size="large"
              className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 shadow-sm"
            />
          </Col>
          <Col xs={24} sm={4}>
            <Input
              type="date"
              value={newGoal.date}
              onChange={(e) => setNewGoal({ ...newGoal, date: e.target.value })}
              size="large"
              className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 shadow-sm"
            />
          </Col>
          <Col xs={24} sm={6}>
            <Button 
              type="primary" 
              icon={<MdAddCircle className="text-lg" />} 
              onClick={handleAddGoal}
              block
              size="large"
              className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 h-10 font-semibold"
            >
              Add Goal
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Goals List */}
      <Card 
        title={
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="p-2 bg-yellow-100 rounded-full">
              <span className="text-xl">🏆</span>
            </div>
            Your Financial Goals ({goals.length})
          </div>
        }
        className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl"
      >
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Spin size="large" />
              <p className="mt-4 text-gray-600 text-lg">Loading your financial goals...</p>
            </div>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📈</div>
            <p className="text-gray-500 text-lg mb-2">No financial goals yet</p>
            <p className="text-gray-400">Start by adding your first goal above!</p>
          </div>
        ) : (
          goals.map((goal) => {
            const daysRemaining = getDaysRemaining(goal.targetDate);
            const isCompleted = goal.progressPercent >= 100;
            
            return (
              <div
                key={goal.goalID}
                className={`p-5 mb-6 rounded-xl border-l-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400' 
                    : daysRemaining < 0 
                    ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-400'
                    : 'bg-gradient-to-r from-white to-blue-50 border-blue-400'
                }`}
              >
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-xl text-gray-800">
                        {goal.goalName}
                      </h3>
                      {/* <Select
                        value={goal.status}
                        onChange={(value) => handleUpdateStatus(goal.goalID, value)}
                        style={{ width: 120 }}
                        size="small"
                        className="rounded-lg"
                      >
                        <Option value="A">🟢 Active</Option>
                        <Option value="I">⚫ Inactive</Option> 
                      </Select> */}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm mb-3">
                      <span className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                        <span className="text-blue-600 font-semibold">🎯</span>
                        <strong className="text-blue-700">Target: Rs. {goal.targetAmount?.toLocaleString()}</strong>
                      </span>
                      <span className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                        <span className="text-green-600 font-semibold">📊</span>
                        <strong className="text-green-700">Current: Rs. {goal.currentProgress?.toLocaleString()}</strong>
                      </span>
                      <span className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
                        <span className="text-purple-600 font-semibold">📅</span>
                        <span className="text-purple-700">Due: {goal.targetDate}</span>
                      </span>
                    </div>

                    {daysRemaining >= 0 ? (
                      <p className="flex items-center gap-2 text-sm bg-blue-50 px-3 py-1 rounded-full w-fit">
                        <span className="text-blue-600">⏳</span>
                        <span className="text-blue-700 font-medium">{daysRemaining} days remaining</span>
                      </p>
                    ) : (
                      <p className="flex items-center gap-2 text-sm bg-red-50 px-3 py-1 rounded-full w-fit">
                        <span className="text-red-600">⚠️</span>
                        <span className="text-red-700 font-medium">Overdue by {Math.abs(daysRemaining)} days</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <Progress
                    percent={goal.progressPercent}
                    status={isCompleted ? "success" : "active"}
                    strokeWidth={16}
                    format={percent => (
                      <span className={`font-bold ${
                        isCompleted ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {percent}% Complete
                      </span>
                    )}
                    strokeColor={
                      isCompleted 
                        ? ['#10b981', '#34d399']
                        : daysRemaining < 0
                        ? ['#ef4444', '#f87171']
                        : ['#3b82f6', '#60a5fa']
                    }
                    className="rounded-full"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Update progress (Rs.)"
                      type="number"
                      value={progressUpdate[goal.goalID] || ""}
                      onChange={(e) => setProgressUpdate({
                        ...progressUpdate, 
                        [goal.goalID]: e.target.value
                      })}
                      style={{ width: 160 }}
                      size="middle"
                      className="rounded-lg border-gray-300"
                    />
                    <Button 
                      size="middle" 
                      onClick={() => handleUpdateProgress(goal.goalID)}
                      className="rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 border-0 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold"
                    >
                      Update
                    </Button>
                  </div>
                  
                  {!isCompleted && (
                    <Button
                      size="middle"
                      type="primary"
                      onClick={() => handleCompleteGoal(goal)}
                      className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 border-0 shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold"
                    >
                      ✅ Mark Complete
                    </Button>
                  )}
                  
                  <Button
                    size="middle"
                    danger
                    icon={<MdDelete className="text-lg" />}
                    onClick={() => handleUpdateStatus(goal.goalID, 'I')}
                    className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 border-0 shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
};

export default PlanningPage;

