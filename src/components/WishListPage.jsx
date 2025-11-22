import React, { useEffect, useState } from "react";
import { Button, Input, Select, message, Card, Statistic, Row, Col, Tag } from "antd";
import { 
  MdAddCircle, 
  MdStar, 
  MdCheckCircle, 
  MdDelete,
  MdPriorityHigh,
  MdTrendingUp,
  MdCalendarToday
} from "react-icons/md";
import { getAllWishes, addWish, markWishCompleted } from "../Services/WishListServices";

const { Option } = Select;

// ✅ Fixed Date Formatting - your procedure returns normal dates
const formatDate = (dateStr) => {
  if (!dateStr) return "No date set";
  try {
    const d = new Date(dateStr);
    if (isNaN(d)) return "Invalid date";
    return d.toISOString().split('T')[0];
  } catch {
    return "Invalid date";
  }
};

// Get priority color and icon
const getPriorityProps = (priority) => {
  switch (priority) {
    case 'High':
      return { color: 'red', icon: <MdPriorityHigh /> };
    case 'Medium':
      return { color: 'orange', icon: <MdTrendingUp /> };
    case 'Low':
      return { color: 'green', icon: <MdStar /> };
    default:
      return { color: 'blue', icon: <MdStar /> };
  }
};

const WishListPage = () => {
  const [wishList, setWishList] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [newWish, setNewWish] = useState({
    name: "",
    cost: "",
    priority: "Medium",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  // Get UserID from localStorage or context
  const getUserId = () => {
    // Replace with your actual user ID retrieval logic
    const userId = localStorage.getItem("UserID") || 1; // Default to 1 if not set
    return parseInt(userId);
  };

  // ✅ Fixed: Fetch all wishes with proper total cost calculation
  const fetchWishes = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      const data = await getAllWishes(userId);
      
      // ✅ Debug: Log the actual response structure
      console.log("Full API response:", data);
      console.log("TotalEstimatedCost:", data?.TotalEstimatedCost);
      console.log("ResultSet:", data?.ResultSet);
      
      // Map backend fields to frontend fields
      const formattedData = Array.isArray(data?.ResultSet)
        ? data.ResultSet.map((wish) => ({
            id: wish.WishID,
            userId: wish.UserID,
            name: wish.ItemName,
            cost: parseFloat(wish.EstimatedCost) || 0, // ✅ Ensure number
            priority: wish.Priority,
            date: formatDate(wish.TargetDate),
            status: wish.Status, // 'A' = Active, 'I' = Inactive/Completed
            createdAt: formatDate(wish.CreatedAt),
            updatedAt: formatDate(wish.UpdatedAt),
          }))
        : [];
      
      setWishList(formattedData);
      
      // ✅ Fixed: Calculate total cost from active wishes
      let calculatedTotal = 0;
      
      // Method 1: Try to get from API response first
      const possibleTotalCostPaths = [
        data?.TotalEstimatedCost,
        data?.totalEstimatedCost,
        data?.totalCost,
        data?.TotalCost,
        data?.[1]?.[0]?.TotalEstimatedCost, // If it's in a second result set
        data?.summary?.TotalEstimatedCost,
      ];
      
      for (const cost of possibleTotalCostPaths) {
        if (cost !== undefined && cost !== null && !isNaN(cost)) {
          calculatedTotal = parseFloat(cost);
          console.log("Found total cost in API:", calculatedTotal);
          break;
        }
      }
      
      // Method 2: If not found in API, calculate manually from active wishes
      if (calculatedTotal === 0) {
        calculatedTotal = formattedData
          .filter(wish => wish.status === 'A')
          .reduce((sum, wish) => sum + (wish.cost || 0), 0);
        console.log("Calculated total manually:", calculatedTotal);
      }
      
      setTotalCost(calculatedTotal);
      
    } catch (error) {
      console.error("Error fetching wishes:", error);
      message.error("Failed to fetch wishes");
      setWishList([]);
      setTotalCost(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  // ✅ Add Wish with all required parameters
  const handleAddWish = async () => {
    if (!newWish.name || !newWish.cost) {
      message.warning("Please fill item name and estimated cost");
      return;
    }

    // Validate cost is a positive number
    const costValue = parseFloat(newWish.cost);
    if (isNaN(costValue) || costValue < 0) {
      message.warning("Please enter a valid cost amount");
      return;
    }

    try {
      const userId = getUserId();
      const wishData = {
        UserID: userId, // ✅ Added UserID
        ItemName: newWish.name.trim(),
        EstimatedCost: costValue,
        Priority: newWish.priority,
        TargetDate: newWish.date || null,
        Status: 'A' // ✅ Added Status
      };

      await addWish(wishData);
      message.success("Wish added successfully!");
      setNewWish({ name: "", cost: "", priority: "Medium", date: "" });
      fetchWishes(); // Refresh the list
    } catch (error) {
      console.error("Error adding wish:", error);
      message.error("Failed to add wish");
    }
  };

  // ✅ Mark Wish as Completed (Status = 'I')
  const handleCompleteWish = async (wishId) => {
    try {
      const userId = getUserId();
      await markWishCompleted(wishId, userId);
      message.success("Wish marked as completed!");
      fetchWishes(); // Refresh the list
    } catch (error) {
      console.error("Error completing wish:", error);
      message.error("Failed to mark wish as completed");
    }
  };

  // ✅ Delete Wish (Mark as Inactive)
  const handleDeleteWish = async (wishId) => {
    try {
      const userId = getUserId();
      await markWishCompleted(wishId, userId); // Using same endpoint to set status to 'I'
      message.success("Wish deleted successfully!");
      fetchWishes(); // Refresh the list
    } catch (error) {
      console.error("Error deleting wish:", error);
      message.error("Failed to delete wish");
    }
  };

  // Filter active and completed wishes
  const activeWishes = wishList.filter(wish => wish.status === 'A');
  const completedWishes = wishList.filter(wish => wish.status === 'I');

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
          ⭐ Dream Wish List
        </h1>
        <p className="text-gray-600 text-lg">Turn your dreams into planned expenses</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={8}>
          <Card 
            className="shadow-lg border-0 bg-gradient-to-r from-blue-400 to-blue-700 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Statistic
              title={<span className="text-white opacity-90">Total Wishes</span>}
              value={activeWishes.length}
              prefix="⭐"
              valueStyle={{ color: '#fff', fontSize: '28px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            className="shadow-lg border-0 bg-gradient-to-r from-emerald-400 to-emerald-700 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Statistic
              title={<span className="text-white opacity-90">Total Estimated Cost</span>}
              value={totalCost}
              precision={2}
              prefix="Rs."
              valueStyle={{ color: '#fff', fontSize: '28px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            className="shadow-lg border-0 bg-gradient-to-r from-purple-400 to-purple-700 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Statistic
              title={<span className="text-white opacity-90">Completed Wishes</span>}
              value={completedWishes.length}
              prefix="✅"
              valueStyle={{ color: '#fff', fontSize: '28px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Add Wish Form */}
      <Card 
        title={
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="p-2 bg-blue-100 rounded-full">
              <MdAddCircle className="text-blue-600 text-xl" />
            </div>
            Add New Wish
          </div>
        } 
        className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl"
      >
        <div className="flex flex-wrap gap-4 mb-2">
          <Input
            placeholder="✨ What do you wish for?"
            value={newWish.name}
            onChange={(e) => setNewWish({ ...newWish, name: e.target.value })}
            style={{ width: 220 }}
            size="large"
            className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 shadow-sm"
          />
          <Input
            placeholder="Estimated Cost"
            type="number"
            min="0"
            step="0.01"
            value={newWish.cost}
            onChange={(e) => setNewWish({ ...newWish, cost: e.target.value })}
            style={{ width: 200 }}
            size="large"
            prefix="Rs."
            className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 shadow-sm"
          />
          <Select
            value={newWish.priority}
            onChange={(value) => setNewWish({ ...newWish, priority: value })}
            style={{ width: 160 }}
            size="large"
            className="rounded-lg shadow-sm"
          >
            <Option value="Low">📗 Low Priority</Option>
            <Option value="Medium">📙 Medium Priority</Option>
            <Option value="High">📕 High Priority</Option>
          </Select>
          <Input
            type="date"
            value={newWish.date}
            onChange={(e) => setNewWish({ ...newWish, date: e.target.value })}
            style={{ width: 200 }}
            size="large"
            className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 shadow-sm"
          />
          <Button 
            type="primary" 
            icon={<MdAddCircle className="text-lg" />} 
            onClick={handleAddWish}
            size="large"
            loading={loading}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 h-10 px-6 font-semibold"
          >
            Add to Wishlist
          </Button>
        </div>
      </Card>

      {/* Active Wishes */}
      <Card 
        title={
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="p-2 bg-orange-100 rounded-full">
              <MdTrendingUp className="text-orange-600 text-xl" />
            </div>
            Active Wishes ({activeWishes.length})
          </div>
        } 
        className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl"
      >
        {activeWishes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-500 text-lg mb-2">Your wish list is empty</p>
            <p className="text-gray-400">Start adding your dreams above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeWishes.map((wish) => {
              const priorityProps = getPriorityProps(wish.priority);
              return (
                <div
                  key={wish.id}
                  className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl border-l-4 border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className="flex flex-wrap justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="font-bold text-xl text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                          {wish.name}
                        </h4>
                        <Tag 
                          color={priorityProps.color} 
                          icon={priorityProps.icon}
                          className="flex items-center gap-1 px-3 py-1 rounded-full font-semibold border-0 shadow-sm"
                        >
                          {wish.priority}
                        </Tag>
                      </div>
                      
                      <div className="flex flex-wrap gap-6 text-sm">
                        <span className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                          <span className="text-blue-600 font-semibold">💰</span>
                          <strong className="text-blue-700">Rs. {wish.cost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                        </span>
                        {wish.date && wish.date !== "Invalid date" && (
                          <span className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                            <MdCalendarToday className="text-green-600" /> 
                            <span className="text-green-700">Target: {wish.date}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
                          <span className="text-purple-600">📅</span>
                          <span className="text-purple-700">Added: {wish.createdAt}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-4 sm:mt-0">
                      {/* <Button
                        type="primary"
                        icon={<MdCheckCircle className="text-lg" />}
                        onClick={() => handleCompleteWish(wish.id)}
                        size="middle"
                        className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 border-0 shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold"
                      >
                        Mark Done
                      </Button> */}  
                      
                      <Button
                        danger
                        icon={<MdDelete className="text-lg" />}
                        onClick={() => handleDeleteWish(wish.id)}
                        size="middle"
                        className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 border-0 shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Completed Wishes */}
      {completedWishes.length > 0 && (
        <Card 
          title={
            <div className="flex items-center gap-2 text-lg font-semibold">
              <div className="p-2 bg-green-100 rounded-full">
                <MdCheckCircle className="text-green-600 text-xl" />
              </div>
              Completed Wishes ({completedWishes.length})
            </div>
          } 
          className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl"
        >
          <div className="space-y-4">
            {completedWishes.map((wish) => {
              const priorityProps = getPriorityProps(wish.priority);
              return (
                <div
                  key={wish.id}
                  className="bg-gradient-to-r from-gray-50 to-green-50 p-5 rounded-xl border-l-4 border-green-400 shadow-sm opacity-90 hover:opacity-100 transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-600 line-through text-lg">
                          {wish.name}
                        </h4>
                        <Tag 
                          color={priorityProps.color} 
                          className="opacity-70 border-0 px-2 py-1 rounded-full"
                        >
                          {wish.priority}
                        </Tag>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          💰 Rs. {wish.cost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span>•</span>
                        <span>{wish.priority} Priority</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          🎉 Completed on {wish.updatedAt}
                        </span>
                      </div>
                    </div>
                    <Tag color="green" className="px-3 py-1 rounded-full font-semibold border-0 shadow-sm">
                      🏆 Achieved
                    </Tag>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default WishListPage;

