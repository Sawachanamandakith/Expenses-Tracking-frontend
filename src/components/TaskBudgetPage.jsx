
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Input,
  Select,
  Row,
  Col,
  Table,
  Modal,
  message,
  Spin,
  Empty
} from "antd";
import {
  MdAddCircle,
  MdEdit,
  MdDelete,
  MdMenu,
} from "react-icons/md";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
  getTaskItems,
  addTaskItem,
  updateTaskItem,
  deleteTaskItem,
  recalculateTaskTotal,
} from "../Services/BudgetPlanService";

const { Option } = Select;

const TaskBudgetPage = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    TaskName: "",
    Description: "",
    StartDate: "",
    EndDate: "",
    MaxBudget: "",
    EstimatedCost: ""
  });

  const [itemModal, setItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    ItemName: "",
    Category: "",
    EstimatedCost: "",
    Notes: "",
  });

  // Check screen size on load and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch all tasks on load
  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getAllTasks();
      console.log("Raw tasks data:", data);

      let tasksData = [];
      
      if (Array.isArray(data)) {
        tasksData = data;
      } else if (data?.ResultSet) {
        tasksData = data.ResultSet;
      } else if (data?.data) {
        tasksData = data.data;
      }

      const mappedTasks = tasksData.map(t => {
        let EstimatedCost = 0;
        
        if (t.TotalEstimated !== null && t.TotalEstimated !== undefined) {
          EstimatedCost = t.EstimatedCost;
        } else if (t.EstimatedCost !== null && t.EstimatedCost !== undefined) {
          EstimatedCost = t.EstimatedCost;
        } else if (t.totalEstimated !== null && t.EstimatedCost !== undefined) {
          EstimatedCost = t.totalEstimated;
        } else if (t.EstimatedCost !== null && t.EstimatedCost !== undefined) {
          EstimatedCost = t.EstimatedCost;
        }
        
        EstimatedCost = isNaN(parseFloat(EstimatedCost)) ? 0 : parseFloat(EstimatedCost);

        return {
          ...t,
          TaskID: t.TaskID || t.id,
          TaskName: t.TaskName || t.Name || t.taskName,
          Description: t.Description || t.description,
          StartDate: t.StartDate || t.startDate,
          EndDate: t.EndDate || t.endDate,
          MaxBudget: t.MaxBudget || t.maxBudget || t.budget,
          TotalEstimated: EstimatedCost
        };
      });

      console.log("Mapped tasks:", mappedTasks);
      setTasks(mappedTasks);
      
      if (mappedTasks.length > 0 && !selectedTask) {
        handleSelectTask(mappedTasks[0]);
      }
    } catch (err) {
      console.error("Error loading tasks:", err);
      message.error("Failed to load tasks");
      setTasks([]);
    }
    setLoading(false);
  };

  // Load items for selected task
  const loadItems = async (taskId) => {
    if (!taskId) {
      setItems([]);
      return;
    }
    
    setItemsLoading(true);
    try {
      const data = await getTaskItems(taskId);
      console.log("Raw items data:", data);

      let itemsData = [];
      
      if (Array.isArray(data)) {
        itemsData = data;
      } else if (data?.ResultSet) {
        itemsData = data.ResultSet;
      } else if (data?.data) {
        itemsData = data.data;
      }

      const mappedItems = itemsData.map(item => ({
        ...item,
        ItemID: item.ItemID || item.id,
        ItemName: item.ItemName || item.name,
        Category: item.Category || item.category,
        EstimatedCost: item.EstimatedCost || item.estimatedCost || item.cost,
        Notes: item.Note || item.notes
      }));

      console.log("Mapped items:", mappedItems);
      setItems(mappedItems);
    } catch (err) {
      console.error("Error loading items:", err);
      message.error("Failed to load items");
      setItems([]);
    }
    setItemsLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Prepare chart data for the selected task
  const getChartData = () => {
    if (!selectedTask) return [];

    const totalEstimated = selectedTask.TotalEstimated || 0;
    const maxBudget = selectedTask.MaxBudget || 0;
    const remainingBudget = Math.max(0, maxBudget - totalEstimated);
    const exceededAmount = Math.max(0, totalEstimated - maxBudget);

    const barChartData = [
      {
        name: "Budget",
        "Total Estimated": totalEstimated,
        "Max Budget": maxBudget,
        "Remaining Budget": remainingBudget,
        "Exceeded Budget": exceededAmount
      }
    ];

    const pieChartData = [
      { name: "Total Estimated", value: totalEstimated },
      { name: "Remaining Budget", value: remainingBudget }
    ];

    return { barChartData, pieChartData };
  };

  const { barChartData, pieChartData } = getChartData();

  // Colors for charts
  const COLORS = {
    bar: {
      "Total Estimated": "#8884d8",
      "Max Budget": "#82ca9d", 
      "Remaining Budget": "#ffc658",
      "Exceeded Budget": "#ff8042"
    },
    pie: ["#8884d8", "#82ca9d"]
  };

  // Create a new task
  const handleAddTask = async () => {
    if (!newTask.TaskName || !newTask.StartDate || !newTask.EndDate) {
      return message.warning("Please fill required fields");
    }

    try {
      const taskData = {
        Name: newTask.TaskName,
        Description: newTask.Description,
        StartDate: newTask.StartDate,
        EndDate: newTask.EndDate,
        MaxBudget: newTask.MaxBudget || null,
        EstimatedCost: newTask.EstimatedCost ? parseFloat(newTask.EstimatedCost) : null
      };

      console.log("Sending task data to backend:", taskData);

      await addTask(taskData);

      message.success("Task created successfully");
      
      setNewTask({
        TaskName: "",
        Description: "",
        StartDate: "",
        EndDate: "",
        MaxBudget: "",
        EstimatedCost: ""
      });
      
      await loadTasks();
    } catch (err) {
      console.error("Error creating task:", err);
      message.error("Failed to create task");
    }
  };

  // When user selects a task
  const handleSelectTask = (task) => {
    setSelectedTask(task);
    loadItems(task.TaskID);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Delete task
  const handleDeleteTask = async (task) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: `Are you sure you want to delete the task "${task.TaskName}"? This will also delete all items associated with this task.`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteTask({ TaskID: task.TaskID });
          message.success("Task deleted successfully");

          if (selectedTask?.TaskID === task.TaskID) {
            setSelectedTask(null);
            setItems([]);
          }

          await loadTasks();
        } catch (err) {
          console.error("Error deleting task:", err);
          message.error("Failed to delete task");
        }
      },
    });
  };

  // Save Item (Add or Edit)
  const handleSaveItem = async () => {
    if (!itemForm.ItemName || !itemForm.EstimatedCost) {
      return message.warning("Please fill required fields");
    }

    if (!selectedTask?.TaskID) {
      return message.error("No task selected");
    }

    try {
      const payload = {
        ...itemForm,
        TaskID: selectedTask.TaskID,
      };

      if (editingItem) {
        payload.ItemID = editingItem.ItemID;
        await updateTaskItem(payload);
        message.success("Item updated successfully");
      } else {
        await addTaskItem(payload);
        message.success("Item added successfully");
      }

      setItemModal(false);
      setEditingItem(null);
      setItemForm({
        ItemName: "",
        Category: "",
        EstimatedCost: "",
        Notes: "",
      });

      await loadItems(selectedTask.TaskID);
      await recalculateTaskTotal({ TaskID: selectedTask.TaskID });
      await loadTasks();
      
    } catch (err) {
      console.error("Error saving item:", err);
      message.error("Failed to save item");
    }
  };

  const handleDeleteItem = async (item) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: `Are you sure you want to delete "${item.ItemName}"?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteTaskItem({ ItemID: item.ItemID });
          message.success("Item deleted successfully");

          await loadItems(selectedTask.TaskID);
          await recalculateTaskTotal({ TaskID: selectedTask.TaskID });
          await loadTasks();
        } catch (err) {
          console.error("Error deleting item:", err);
          message.error("Failed to delete item");
        }
      },
    });
  };

  // Table columns for items - mobile optimized
  const itemColumns = isMobile ? [
    {
      title: "Item",
      dataIndex: "ItemName",
      key: "ItemName",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.Category}</div>
          <div className="text-sm font-semibold">Rs. {record.EstimatedCost}</div>
          {record.Notes && (
            <div className="text-xs text-gray-600 mt-1">{record.Notes}</div>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <div className="flex gap-2">
          <MdEdit
            className="text-blue-500 text-lg cursor-pointer hover:text-blue-700"
            onClick={() => {
              setEditingItem(record);
              setItemForm({
                ItemName: record.ItemName,
                Category: record.Category,
                EstimatedCost: record.EstimatedCost,
                Notes: record.Notes,
              });
              setItemModal(true);
            }}
          />
          <MdDelete
            className="text-red-500 text-lg cursor-pointer hover:text-red-700"
            onClick={() => handleDeleteItem(record)}
          />
        </div>
      ),
    },
  ] : [
    {
      title: "Item Name",
      dataIndex: "ItemName",
      key: "ItemName",
    },
    {
      title: "Category",
      dataIndex: "Category",
      key: "Category",
    },
    {
      title: "Estimated Cost",
      dataIndex: "EstimatedCost",
      key: "EstimatedCost",
      render: (cost) => `Rs. ${cost}`,
    },
    {
      title: "Notes",
      dataIndex: "Notes",
      key: "Notes",
      render: (notes) => notes || "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-3">
          <MdEdit
            className="text-blue-500 text-xl cursor-pointer hover:text-blue-700"
            onClick={() => {
              setEditingItem(record);
              setItemForm({
                ItemName: record.ItemName,
                Category: record.Category,
                EstimatedCost: record.EstimatedCost,
                Notes: record.Notes,
              });
              setItemModal(true);
            }}
          />
          <MdDelete
            className="text-red-500 text-xl cursor-pointer hover:text-red-700"
            onClick={() => handleDeleteItem(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      {/* Mobile Header with Menu Button */}
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            📝 Budget Planner
          </h1>
          <Button
            icon={<MdMenu />}
            type="text"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-xl"
          />
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            📝 Task Budget Planning
          </h1>
          <p className="text-gray-600">Plan tasks, estimate expenses, control your spending</p>
        </div>
      )}

      <Row gutter={[16, 16]}>
        {/* Task List - Conditional rendering for mobile */}
        {(!isMobile || mobileMenuOpen) && (
          <Col xs={24} md={8}>
            <Card
              title="Your Tasks"
              className="rounded-xl shadow-lg bg-white/80 backdrop-blur-sm"
              loading={loading}
              extra={isMobile && (
                <Button 
                  type="text" 
                  size="small" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Close
                </Button>
              )}
            >
              {tasks.length === 0 && !loading ? (
                <Empty description="No tasks found" />
              ) : (
                <div className="max-h-[400px] md:max-h-none overflow-y-auto">
                  {tasks.map((task) => (
                    <div
                      key={task.TaskID}
                      className={`p-3 mb-3 rounded-lg border cursor-pointer 
                        hover:bg-blue-50 transition-all relative
                        ${selectedTask?.TaskID === task.TaskID ? "bg-blue-100 border-blue-500" : "border-gray-300"}
                      `}
                      onClick={() => handleSelectTask(task)}
                    >
                      <MdDelete
                        className="absolute top-2 right-2 text-red-500 text-lg cursor-pointer hover:text-red-700 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task);
                        }}
                      />
                      <h3 className="font-bold text-gray-700 pr-6">{task.TaskName}</h3>
                      <p className="text-sm text-gray-500">
                        {task.StartDate} to {task.EndDate}
                      </p>
                      <p className="text-sm font-medium">
                        Estimated: Rs. {task.TotalEstimated || 0}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Add new task */}
            <Card
              title="Add New Task"
              className="mt-4 rounded-xl shadow-lg bg-white/80 backdrop-blur-sm"
            >
              <Input
                placeholder="Task Name *"
                value={newTask.TaskName}
                onChange={(e) => setNewTask({ ...newTask, TaskName: e.target.value })}
                className="mb-3"
                size={isMobile ? "large" : "middle"}
              />
              <Input.TextArea
                placeholder="Description"
                value={newTask.Description}
                onChange={(e) => setNewTask({ ...newTask, Description: e.target.value })}
                className="mb-3"
                rows={3}
              />
              <Row gutter={8}>
                <Col span={12}>
                  <label className="block text-xs md:text-sm font-medium mb-1">Start Date</label>
                  <Input
                    type="date"
                    value={newTask.StartDate}
                    onChange={(e) => setNewTask({ ...newTask, StartDate: e.target.value })}
                    className="mb-3"
                    size={isMobile ? "large" : "middle"}
                    placeholder="yyyy-mm-dd"
                  />
                </Col>
                <Col span={12}>
                  <label className="block text-xs md:text-sm font-medium mb-1">End Date</label>
                  <Input
                    type="date"
                    value={newTask.EndDate}
                    onChange={(e) => setNewTask({ ...newTask, EndDate: e.target.value })}
                    className="mb-3"
                    size={isMobile ? "large" : "middle"}
                    placeholder="yyyy-mm-dd"
                  />
                </Col>
              </Row>

              <Input
                placeholder="Max Budget (optional)"
                type="number"
                value={newTask.MaxBudget}
                onChange={(e) => setNewTask({ ...newTask, MaxBudget: e.target.value })}
                className="mb-3"
                size={isMobile ? "large" : "middle"}
              />

              <Input
                placeholder="Initial Estimated Total (optional)"
                type="number"
                value={newTask.EstimatedCost}
                onChange={(e) => setNewTask({ ...newTask, EstimatedCost: e.target.value })}
                className="mb-4"
                size={isMobile ? "large" : "middle"}
              />

              <Button
                type="primary"
                icon={<MdAddCircle />}
                onClick={handleAddTask}
                block
                className="rounded-lg"
                size={isMobile ? "large" : "middle"}
              >
                Create Task
              </Button>
            </Card>
          </Col>
        )}

        {/* Main Content - Charts, Items, Summary */}
        {(!isMobile || !mobileMenuOpen) && (
          <Col xs={24} md={16}>
            {selectedTask ? (
              <>
                {/* Budget Charts - Stack on mobile */}
                <Card 
                  title={`Budget - ${selectedTask.TaskName}`}
                  className="rounded-xl shadow-lg bg-white/80 backdrop-blur-sm mb-4"
                >
                  <Row gutter={[16, 16]}>
                    {/* Bar Chart */}
                    <Col xs={24} lg={12}>
                      <div className="text-center font-medium mb-2 text-sm md:text-base">
                        Budget Comparison
                      </div>
                      <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                        <BarChart 
                          data={barChartData} 
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          layout={isMobile ? "vertical" : "horizontal"}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          {isMobile ? (
                            <YAxis type="category" dataKey="name" />
                          ) : (
                            <XAxis dataKey="name" />
                          )}
                          {isMobile ? (
                            <XAxis type="number" />
                          ) : (
                            <YAxis />
                          )}
                          <Tooltip 
                            formatter={(value) => [`Rs. ${value}`, ""]}
                          />
                          <Legend />
                          <Bar 
                            dataKey="Total Estimated" 
                            fill={COLORS.bar["Total Estimated"]} 
                            name="Total Estimated"
                          />
                          <Bar 
                            dataKey="Max Budget" 
                            fill={COLORS.bar["Max Budget"]} 
                            name="Max Budget"
                          />
                          <Bar 
                            dataKey="Remaining Budget" 
                            fill={COLORS.bar["Remaining Budget"]} 
                            name="Remaining Budget"
                          />
                          {(selectedTask.MaxBudget && (selectedTask.TotalEstimated || 0) > selectedTask.MaxBudget) && (
                            <Bar 
                              dataKey="Exceeded Budget" 
                              fill={COLORS.bar["Exceeded Budget"]} 
                              name="Exceeded Budget"
                            />
                          )}
                        </BarChart>
                      </ResponsiveContainer>
                    </Col>

                    {/* Pie Chart */}
                    <Col xs={24} lg={12}>
                      <div className="text-center font-medium mb-2 text-sm md:text-base">
                        Budget Distribution
                      </div>
                      <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value, percent }) => 
                              isMobile 
                                ? `${name}\n${(percent * 100).toFixed(0)}%`
                                : `${name}: Rs.${value} (${(percent * 100).toFixed(0)}%)`
                            }
                            outerRadius={isMobile ? 80 : 100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS.pie[index % COLORS.pie.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`Rs. ${value}`, ""]} />
                          {!isMobile && <Legend />}
                        </PieChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                </Card>

                {/* Items Table */}
                <Card
                  title={
                    <span className="text-sm md:text-base">
                      Items for "<strong>{selectedTask.TaskName}</strong>"
                    </span>
                  }
                  className="rounded-xl shadow-lg bg-white/80 backdrop-blur-sm"
                  extra={
                    <Button
                      type="primary"
                      icon={<MdAddCircle />}
                      onClick={() => {
                        setItemForm({
                          ItemName: "",
                          Category: "",
                          EstimatedCost: "",
                          Notes: "",
                        });
                        setEditingItem(null);
                        setItemModal(true);
                      }}
                      size={isMobile ? "small" : "middle"}
                    >
                      {isMobile ? "Add" : "Add Item"}
                    </Button>
                  }
                >
                  {itemsLoading ? (
                    <div className="text-center py-8">
                      <Spin size="large" />
                    </div>
                  ) : items.length === 0 ? (
                    <Empty description="No items found" />
                  ) : (
                    <Table
                      columns={itemColumns}
                      dataSource={items}
                      rowKey="ItemID"
                      pagination={false}
                      scroll={{ x: isMobile ? 300 : 600 }}
                      size={isMobile ? "small" : "middle"}
                    />
                  )}
                </Card>

                {/* Summary */}
                <Card 
                  title="Budget Summary" 
                  className="mt-4 shadow-lg rounded-xl bg-white/80"
                >
                  <div className="space-y-3">
                    <p className="text-base md:text-lg">
                      Total Estimated Cost: 
                      <b className="text-blue-600 ml-2">Rs. {selectedTask.TotalEstimated || 0}</b>
                    </p>

                    {selectedTask.MaxBudget && (
                      <>
                        <p className="text-base md:text-lg">
                          Max Budget:  
                          <b className="text-purple-600 ml-2">Rs. {selectedTask.MaxBudget}</b>
                        </p>

                        <p className="text-base md:text-lg">
                          Remaining Budget:  
                          <b 
                            className={`ml-2 ${
                              (selectedTask.MaxBudget - (selectedTask.TotalEstimated || 0)) >= 0 
                                ? "text-green-600" 
                                : "text-red-600"
                            }`}
                          >
                            Rs. {selectedTask.MaxBudget - (selectedTask.TotalEstimated || 0)}
                          </b>
                        </p>

                        {(selectedTask.MaxBudget - (selectedTask.TotalEstimated || 0)) < 0 && (
                          <p className="text-red-500 font-semibold text-sm md:text-base">
                            ⚠️ Warning: You have exceeded your budget!
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              </>
            ) : (
              <Card className="text-center p-6 md:p-10 rounded-xl shadow-lg bg-white/80">
                <Empty 
                  description={
                    tasks.length === 0 
                      ? "No tasks available. Create your first task to get started!" 
                      : isMobile 
                        ? "Tap menu to select task" 
                        : "Select a task to view details"
                  }
                />
                {isMobile && tasks.length > 0 && (
                  <Button 
                    type="primary" 
                    className="mt-4"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    Open Task Menu
                  </Button>
                )}
              </Card>
            )}
          </Col>
        )}
      </Row>

      {/* Item Modal */}
      <Modal
        open={itemModal}
        onCancel={() => {
          setItemModal(false);
          setEditingItem(null);
          setItemForm({
            ItemName: "",
            Category: "",
            EstimatedCost: "",
            Notes: "",
          });
        }}
        onOk={handleSaveItem}
        okText={editingItem ? "Update Item" : "Add Item"}
        title={editingItem ? "Edit Item" : "Add New Item"}
        destroyOnClose
        width={isMobile ? "90%" : 520}
      >
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Item Name *</label>
            <Input
              placeholder="Enter item name"
              value={itemForm.ItemName}
              onChange={(e) => setItemForm({ ...itemForm, ItemName: e.target.value })}
              size={isMobile ? "large" : "middle"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select
              value={itemForm.Category}
              onChange={(v) => setItemForm({ ...itemForm, Category: v })}
              style={{ width: "100%" }}
              placeholder="Select category"
              allowClear
              size={isMobile ? "large" : "middle"}
            >
              <Option value="Supplies">Supplies</Option>
              <Option value="Food">Food</Option>
              <Option value="Travel">Travel</Option>
              <Option value="Tools">Tools</Option>
              <Option value="Misc">Misc</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estimated Cost *</label>
            <Input
              placeholder="Enter estimated cost"
              type="number"
              value={itemForm.EstimatedCost}
              onChange={(e) => setItemForm({ ...itemForm, EstimatedCost: e.target.value })}
              size={isMobile ? "large" : "middle"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Input.TextArea
              placeholder="Add any notes (optional)"
              value={itemForm.Note}
              onChange={(e) => setItemForm({ ...itemForm, Note: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskBudgetPage;

