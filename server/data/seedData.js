export const seedUsers = [
  {
    id: "usr_student_1",
    name: "Aditya Sharma",
    collegeId: "2023CS0101",
    email: "student@college.edu",
    password: "student123", // hashed on startup
    phone: "9876543210",
    role: "student"
  },
  {
    id: "usr_student_2",
    name: "Priya Patel",
    collegeId: "2023IT0204",
    email: "priya@college.edu",
    password: "student123",
    phone: "9876543211",
    role: "student"
  },
  {
    id: "usr_student_3",
    name: "Rahul Verma",
    collegeId: "2023EC0312",
    email: "rahul@college.edu",
    password: "student123",
    phone: "9876543212",
    role: "student"
  },
  {
    id: "usr_student_4",
    name: "Ananya Iyer",
    collegeId: "2023ME0415",
    email: "ananya@college.edu",
    password: "student123",
    phone: "9876543213",
    role: "student"
  },
  {
    id: "usr_student_5",
    name: "Arjun Reddy",
    collegeId: "2023EE0520",
    email: "arjun@college.edu",
    password: "student123",
    phone: "9876543214",
    role: "student"
  },
  {
    id: "usr_admin_1",
    name: "Canteen Staff Manager",
    collegeId: "STAFF001",
    email: "admin@college.edu",
    password: "admin123",
    phone: "9876543299",
    role: "admin"
  }
];

export const seedFoods = [
  {
    id: "food_01",
    name: "Idli Sambar",
    category: "Breakfast",
    price: 30,
    prepTime: "5 mins",
    description: "Steamed fluffy rice cakes (2 pcs) served with piping hot vegetable sambar & coconut chutney.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
    availability: true,
    rating: 4.8,
    isPopular: true
  },
  {
    id: "food_02",
    name: "Veg Noodles",
    category: "Meals",
    price: 70,
    prepTime: "10 mins",
    description: "Wok-tossed Hakka noodles with julienned bell peppers, shredded cabbage, carrots & mild chili sauce.",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80",
    availability: true,
    rating: 4.7,
    isPopular: true
  },
  {
    id: "food_03",
    name: "Veg Sandwich",
    category: "Snacks",
    price: 40,
    prepTime: "6 mins",
    description: "Crispy grilled sandwich with cucumber, tomatoes, seasoned potatoes, cheese & fresh coriander mint chutney.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
    availability: true,
    rating: 4.5,
    isPopular: true
  },
  {
    id: "food_04",
    name: "Veg Fried Rice",
    category: "Meals",
    price: 80,
    prepTime: "10 mins",
    description: "Fragrant basmati rice tossed with garden green peas, carrots, spring onions and savory seasoning.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80",
    availability: true,
    rating: 4.9,
    isPopular: true
  },
  {
    id: "food_05",
    name: "Masala Dosa",
    category: "Breakfast",
    price: 40,
    prepTime: "8 mins",
    description: "Crispy golden crepe roasted in ghee, filled with spiced mashed potato bhaji and served with chutneys.",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
    availability: true,
    rating: 4.9,
    isPopular: true
  },
  {
    id: "food_06",
    name: "Lemon Rice",
    category: "Meals",
    price: 50,
    prepTime: "5 mins",
    description: "Zesty South Indian turmeric-infused rice tempered with mustard seeds, curry leaves, and crunchy peanuts.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
    availability: true,
    rating: 4.4,
    isPopular: false
  },
  {
    id: "food_07",
    name: "Crispy Samosa (2 Pcs)",
    category: "Snacks",
    price: 20,
    prepTime: "3 mins",
    description: "Traditional triangular flaky pastries stuffed with spiced potato mash, served with tangy tamarind dip.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    availability: true,
    rating: 4.8,
    isPopular: true
  },
  {
    id: "food_08",
    name: "Masala Tea",
    category: "Beverages",
    price: 15,
    prepTime: "3 mins",
    description: "Freshly brewed invigorating Assam milk tea infused with crushed ginger, cardamom, and clove spices.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    availability: true,
    rating: 4.9,
    isPopular: true
  },
  {
    id: "food_09",
    name: "South Indian Filter Coffee",
    category: "Beverages",
    price: 20,
    prepTime: "4 mins",
    description: "Frothy, rich filter coffee brewed with authentic chicory blend and creamy frothed milk.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    availability: true,
    rating: 4.8,
    isPopular: true
  },
  {
    id: "food_10",
    name: "Fresh Orange Juice",
    category: "Beverages",
    price: 40,
    prepTime: "5 mins",
    description: "Pure chilled vitamin C rich juice freshly squeezed from sweet Nagpur oranges. 100% natural, no added sugar.",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
    availability: true,
    rating: 4.6,
    isPopular: false
  },
  {
    id: "food_11",
    name: "Paneer Kathi Roll",
    category: "Snacks",
    price: 60,
    prepTime: "8 mins",
    description: "Soft buttered paratha wrap loaded with tandoori spiced paneer cubes, sautéed capsicum & tangy mint mayo.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
    availability: true,
    rating: 4.7,
    isPopular: true
  },
  {
    id: "food_12",
    name: "Chole Bhature",
    category: "Meals",
    price: 75,
    prepTime: "12 mins",
    description: "North Indian specialty: two hot golden puffed bhaturas served with robust spicy chickpea curry and pickled onions.",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80",
    availability: false, // marked unavailable to test student/admin toggle!
    rating: 4.9,
    isPopular: true
  }
];

export const seedOrders = [
  {
    id: "ORD-20260922-001",
    orderNumber: "ORD-20260922-001",
    userId: "usr_student_1",
    studentName: "Aditya Sharma",
    studentCollegeId: "2023CS0101",
    studentPhone: "9876543210",
    items: [
      { foodId: "food_04", name: "Veg Fried Rice", price: 80, quantity: 1, subtotal: 80 },
      { foodId: "food_08", name: "Masala Tea", price: 15, quantity: 1, subtotal: 15 }
    ],
    totalAmount: 95,
    paymentMethod: "GPay / UPI",
    paymentStatus: "PAID",
    transactionId: "TXN20260922001",
    orderStatus: "Ready for Pickup",
    estimatedPrepTime: 10,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    qrData: JSON.stringify({
      orderId: "ORD-20260922-001",
      collegeId: "2023CS0101",
      totalAmount: 95,
      paymentStatus: "PAID"
    })
  },
  {
    id: "ORD-20260922-002",
    orderNumber: "ORD-20260922-002",
    userId: "usr_student_2",
    studentName: "Priya Patel",
    studentCollegeId: "2023IT0204",
    studentPhone: "9876543211",
    items: [
      { foodId: "food_01", name: "Idli Sambar", price: 30, quantity: 2, subtotal: 60 },
      { foodId: "food_09", name: "South Indian Filter Coffee", price: 20, quantity: 1, subtotal: 20 }
    ],
    totalAmount: 80,
    paymentMethod: "GPay / UPI",
    paymentStatus: "PAID",
    transactionId: "TXN20260922002",
    orderStatus: "Preparing",
    estimatedPrepTime: 8,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60000).toISOString(),
    qrData: JSON.stringify({
      orderId: "ORD-20260922-002",
      collegeId: "2023IT0204",
      totalAmount: 80,
      paymentStatus: "PAID"
    })
  },
  {
    id: "ORD-20260922-003",
    orderNumber: "ORD-20260922-003",
    userId: "usr_student_3",
    studentName: "Rahul Verma",
    studentCollegeId: "2023EC0312",
    studentPhone: "9876543212",
    items: [
      { foodId: "food_02", name: "Veg Noodles", price: 70, quantity: 1, subtotal: 70 },
      { foodId: "food_07", name: "Crispy Samosa (2 Pcs)", price: 20, quantity: 1, subtotal: 20 }
    ],
    totalAmount: 90,
    paymentMethod: "Cash at Counter",
    paymentStatus: "PENDING",
    transactionId: null,
    orderStatus: "Order Placed",
    estimatedPrepTime: 12,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    qrData: JSON.stringify({
      orderId: "ORD-20260922-003",
      collegeId: "2023EC0312",
      totalAmount: 90,
      paymentStatus: "PENDING"
    })
  },
  {
    id: "ORD-20260922-004",
    orderNumber: "ORD-20260922-004",
    userId: "usr_student_4",
    studentName: "Ananya Iyer",
    studentCollegeId: "2023ME0415",
    studentPhone: "9876543213",
    items: [
      { foodId: "food_05", name: "Masala Dosa", price: 40, quantity: 1, subtotal: 40 }
    ],
    totalAmount: 40,
    paymentMethod: "GPay / UPI",
    paymentStatus: "PAID",
    transactionId: "TXN20260922004",
    orderStatus: "Collected",
    estimatedPrepTime: 0,
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    qrData: JSON.stringify({
      orderId: "ORD-20260922-004",
      collegeId: "2023ME0415",
      totalAmount: 40,
      paymentStatus: "PAID"
    })
  },
  {
    id: "ORD-20260922-005",
    orderNumber: "ORD-20260922-005",
    userId: "usr_student_5",
    studentName: "Arjun Reddy",
    studentCollegeId: "2023EE0520",
    studentPhone: "9876543214",
    items: [
      { foodId: "food_11", name: "Paneer Kathi Roll", price: 60, quantity: 2, subtotal: 120 },
      { foodId: "food_10", name: "Fresh Orange Juice", price: 40, quantity: 1, subtotal: 40 }
    ],
    totalAmount: 160,
    paymentMethod: "GPay / UPI",
    paymentStatus: "PAID",
    transactionId: "TXN20260922005",
    orderStatus: "Collected",
    estimatedPrepTime: 0,
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 75 * 60000).toISOString(),
    qrData: JSON.stringify({
      orderId: "ORD-20260922-005",
      collegeId: "2023EE0520",
      totalAmount: 160,
      paymentStatus: "PAID"
    })
  },
  {
    id: "ORD-20260922-006",
    orderNumber: "ORD-20260922-006",
    userId: "usr_student_1",
    studentName: "Aditya Sharma",
    studentCollegeId: "2023CS0101",
    studentPhone: "9876543210",
    items: [
      { foodId: "food_03", name: "Veg Sandwich", price: 40, quantity: 1, subtotal: 40 },
      { foodId: "food_08", name: "Masala Tea", price: 15, quantity: 1, subtotal: 15 }
    ],
    totalAmount: 55,
    paymentMethod: "Cash at Counter",
    paymentStatus: "PAID",
    transactionId: null,
    orderStatus: "Collected",
    estimatedPrepTime: 0,
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 140 * 60000).toISOString(),
    qrData: JSON.stringify({
      orderId: "ORD-20260922-006",
      collegeId: "2023CS0101",
      totalAmount: 55,
      paymentStatus: "PAID"
    })
  },
  {
    id: "ORD-20260922-007",
    orderNumber: "ORD-20260922-007",
    userId: "usr_student_2",
    studentName: "Priya Patel",
    studentCollegeId: "2023IT0204",
    studentPhone: "9876543211",
    items: [
      { foodId: "food_04", name: "Veg Fried Rice", price: 80, quantity: 2, subtotal: 160 }
    ],
    totalAmount: 160,
    paymentMethod: "GPay / UPI",
    paymentStatus: "PAID",
    transactionId: "TXN20260922007",
    orderStatus: "Collected",
    estimatedPrepTime: 0,
    createdAt: new Date(Date.now() - 240 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 200 * 60000).toISOString(),
    qrData: JSON.stringify({
      orderId: "ORD-20260922-007",
      collegeId: "2023IT0204",
      totalAmount: 160,
      paymentStatus: "PAID"
    })
  },
  {
    id: "ORD-20260922-008",
    orderNumber: "ORD-20260922-008",
    userId: "usr_student_3",
    studentName: "Rahul Verma",
    studentCollegeId: "2023EC0312",
    studentPhone: "9876543212",
    items: [
      { foodId: "food_06", name: "Lemon Rice", price: 50, quantity: 1, subtotal: 50 },
      { foodId: "food_09", name: "South Indian Filter Coffee", price: 20, quantity: 1, subtotal: 20 }
    ],
    totalAmount: 70,
    paymentMethod: "GPay / UPI",
    paymentStatus: "PAID",
    transactionId: "TXN20260922008",
    orderStatus: "Collected",
    estimatedPrepTime: 0,
    createdAt: new Date(Date.now() - 300 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 260 * 60000).toISOString(),
    qrData: JSON.stringify({
      orderId: "ORD-20260922-008",
      collegeId: "2023EC0312",
      totalAmount: 70,
      paymentStatus: "PAID"
    })
  },
  {
    id: "ORD-20260922-009",
    orderNumber: "ORD-20260922-009",
    userId: "usr_student_4",
    studentName: "Ananya Iyer",
    studentCollegeId: "2023ME0415",
    studentPhone: "9876543213",
    items: [
      { foodId: "food_02", name: "Veg Noodles", price: 70, quantity: 2, subtotal: 140 }
    ],
    totalAmount: 140,
    paymentMethod: "GPay / UPI",
    paymentStatus: "PAID",
    transactionId: "TXN20260922009",
    orderStatus: "Collected",
    estimatedPrepTime: 0,
    createdAt: new Date(Date.now() - 360 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 320 * 60000).toISOString(),
    qrData: JSON.stringify({
      orderId: "ORD-20260922-009",
      collegeId: "2023ME0415",
      totalAmount: 140,
      paymentStatus: "PAID"
    })
  },
  {
    id: "ORD-20260922-010",
    orderNumber: "ORD-20260922-010",
    userId: "usr_student_5",
    studentName: "Arjun Reddy",
    studentCollegeId: "2023EE0520",
    studentPhone: "9876543214",
    items: [
      { foodId: "food_01", name: "Idli Sambar", price: 30, quantity: 1, subtotal: 30 },
      { foodId: "food_07", name: "Crispy Samosa (2 Pcs)", price: 20, quantity: 2, subtotal: 40 },
      { foodId: "food_08", name: "Masala Tea", price: 15, quantity: 1, subtotal: 15 }
    ],
    totalAmount: 85,
    paymentMethod: "Cash at Counter",
    paymentStatus: "PAID",
    transactionId: null,
    orderStatus: "Collected",
    estimatedPrepTime: 0,
    createdAt: new Date(Date.now() - 420 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 380 * 60000).toISOString(),
    qrData: JSON.stringify({
      orderId: "ORD-20260922-010",
      collegeId: "2023EE0520",
      totalAmount: 85,
      paymentStatus: "PAID"
    })
  }
];

export const seedNotifications = [
  {
    id: "notif_1",
    userId: "usr_student_1",
    orderId: "ORD-20260922-001",
    title: "Order Ready for Pickup!",
    message: "Your order ORD-20260922-001 is ready at the canteen counter. Please present your QR code.",
    type: "ready",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: "notif_2",
    userId: "usr_student_2",
    orderId: "ORD-20260922-002",
    title: "Food Being Prepared",
    message: "Chef Rajan started preparing your Idli Sambar and Filter Coffee.",
    type: "preparing",
    read: false,
    createdAt: new Date(Date.now() - 8 * 60000).toISOString()
  },
  {
    id: "notif_3",
    userId: "usr_student_3",
    orderId: "ORD-20260922-003",
    title: "Order Placed (Cash Pending)",
    message: "Your order ORD-20260922-003 has been placed. Pay ₹90 at counter when collecting.",
    type: "placed",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString()
  }
];
