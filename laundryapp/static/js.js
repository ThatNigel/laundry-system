  <script>
        // Data storage (in real app, this would be in database)
        let customers = JSON.parse(localStorage.getItem('laundry_customers') || '[]');
        let services = JSON.parse(localStorage.getItem('laundry_services') || '[]');
        let orders = JSON.parse(localStorage.getItem('laundry_orders') || '[]');
        let nextCustomerId = parseInt(localStorage.getItem('next_customer_id') || '1');
        let nextServiceId = parseInt(localStorage.getItem('next_service_id') || '1');
        let nextOrderId = parseInt(localStorage.getItem('next_order_id') || '1');

        // Initialize with sample data if empty
        if (customers.length === 0) {
            customers = [
                {id: 1, name: 'John Smith', phone: '555-0101', email: 'john@email.com', address: '123 Main St'},
                {id: 2, name: 'Sarah Johnson', phone: '555-0102', email: 'sarah@email.com', address: '456 Oak Ave'}
            ];
            nextCustomerId = 3;
        }

        if (services.length === 0) {
            services = [
                {id: 1, name: 'Wash & Fold', price: 15.99, duration: 24, description: 'Standard washing and folding service'},
                {id: 2, name: 'Dry Cleaning', price: 25.99, duration: 48, description: 'Professional dry cleaning service'},
                {id: 3, name: 'Express Wash', price: 22.99, duration: 4, description: 'Same day express service'}
            ];
            nextServiceId = 4;
        }

        if (orders.length === 0) {
            orders = [
                {id: 1, customerId: 1, serviceId: 1, quantity: 2, total: 31.98, status: 'processing', date: new Date().toISOString(), notes: ''},
                {id: 2, customerId: 2, serviceId: 2, quantity: 1, total: 25.99, status: 'ready', date: new Date().toISOString(), notes: 'Handle with care'}
            ];
            nextOrderId = 3;
        }

        // Tab Management
        function showTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));

            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');

            if (tabName === 'dashboard') updateDashboard();
            if (tabName === 'customers') loadCustomers();
            if (tabName === 'services') loadServices();
            if (tabName === 'orders') loadOrders();
        }

        // Modal Management
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
            if (modalId === 'orderModal') {
                populateOrderSelects();
            }
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
            document.getElementById(modalId.replace('Modal', 'Form')).reset();
        }

        // Dashboard Functions
        function updateDashboard() {
            document.getElementById('totalCustomers').textContent = customers.length;
            document.getElementById('totalOrders').textContent = orders.length;
            document.getElementById('pendingOrders').textContent = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
            document.getElementById('totalRevenue').textContent = '$' + orders.reduce((sum, o) => sum + o.total, 0).toFixed(2);
        }

        // Customer CRUD Operations
        function loadCustomers() {
            const tbody = document.querySelector('#customersTable tbody');
            tbody.innerHTML = '';

            customers.forEach(customer => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.email || 'N/A'}</td>
                    <td>${customer.address || 'N/A'}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editCustomer(${customer.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteCustomer(${customer.id})">Delete</button>
                    </td>
                `;
            });
        }

        function editCustomer(id) {
            const customer = customers.find(c => c.id === id);
            if (customer) {
                document.getElementById('customerId').value = customer.id;
                document.getElementById('customerName').value = customer.name;
                document.getElementById('customerPhone').value = customer.phone;
                document.getElementById('customerEmail').value = customer.email || '';
                document.getElementById('customerAddress').value = customer.address || '';
                document.getElementById('customerModalTitle').textContent = 'Edit Customer';
                openModal('customerModal');
            }
        }

        function deleteCustomer(id) {
            if (confirm('Are you sure you want to delete this customer?')) {
                customers = customers.filter(c => c.id !== id);
                saveData();
                loadCustomers();
                updateDashboard();
            }
        }

        function searchCustomers() {
            const search = document.getElementById('customerSearch').value.toLowerCase();
            const rows = document.querySelectorAll('#customersTable tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(search) ? '' : 'none';
            });
        }

        // Service CRUD Operations
        function loadServices() {
            const tbody = document.querySelector('#servicesTable tbody');
            tbody.innerHTML = '';

            services.forEach(service => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${service.id}</td>
                    <td>${service.name}</td>
                    <td>$${service.price.toFixed(2)}</td>
                    <td>${service.duration}</td>
                    <td>${service.description || 'N/A'}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editService(${service.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteService(${service.id})">Delete</button>
                    </td>
                `;
            });
        }

        function editService(id) {
            const service = services.find(s => s.id === id);
            if (service) {
                document.getElementById('serviceId').value = service.id;
                document.getElementById('serviceName').value = service.name;
                document.getElementById('servicePrice').value = service.price;
                document.getElementById('serviceDuration').value = service.duration;
                document.getElementById('serviceDescription').value = service.description || '';
                document.getElementById('serviceModalTitle').textContent = 'Edit Service';
                openModal('serviceModal');
            }
        }

        function deleteService(id) {
            if (confirm('Are you sure you want to delete this service?')) {
                services = services.filter(s => s.id !== id);
                saveData();
                loadServices();
            }
        }

        // Order CRUD Operations
        function loadOrders() {
            const tbody = document.querySelector('#ordersTable tbody');
            tbody.innerHTML = '';

            orders.forEach(order => {
                const customer = customers.find(c => c.id === order.customerId);
                const service = services.find(s => s.id === order.serviceId);
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${customer ? customer.name : 'Unknown'}</td>
                    <td>${service ? service.name : 'Unknown'}</td>
                    <td>${order.quantity}</td>
                    <td>$${order.total.toFixed(2)}</td>
                    <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                    <td>${new Date(order.date).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editOrder(${order.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteOrder(${order.id})">Delete</button>
                    </td>
                `;
            });
        }

        function editOrder(id) {
            const order = orders.find(o => o.id === id);
            if (order) {
                document.getElementById('orderId').value = order.id;
                document.getElementById('orderCustomer').value = order.customerId;
                document.getElementById('orderService').value = order.serviceId;
                document.getElementById('orderQuantity').value = order.quantity;
                document.getElementById('orderTotal').value = order.total;
                document.getElementById('orderStatus').value = order.status;
                document.getElementById('orderNotes').value = order.notes || '';
                document.getElementById('orderModalTitle').textContent = 'Edit Order';
                populateOrderSelects();
                openModal('orderModal');
            }
        }

        function deleteOrder(id) {
            if (confirm('Are you sure you want to delete this order?')) {
                orders = orders.filter(o => o.id !== id);
                saveData();
                loadOrders();
                updateDashboard();
            }
        }

        function searchOrders() {
            const search = document.getElementById('orderSearch').value.toLowerCase();
            const rows = document.querySelectorAll('#ordersTable tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(search) ? '' : 'none';
            });
        }

        function populateOrderSelects() {
            const customerSelect = document.getElementById('orderCustomer');
            const serviceSelect = document.getElementById('orderService');

            customerSelect.innerHTML = '<option value="">Select Customer</option>';
            customers.forEach(customer => {
                customerSelect.innerHTML += `<option value="${customer.id}">${customer.name}</option>`;
            });

            serviceSelect.innerHTML = '<option value="">Select Service</option>';
            services.forEach(service => {
                serviceSelect.innerHTML += `<option value="${service.id}" data-price="${service.price}">${service.name} - $${service.price.toFixed(2)}</option>`;
            });
        }

        function updateOrderPrice() {
            const serviceSelect = document.getElementById('orderService');
            const quantity = parseInt(document.getElementById('orderQuantity').value) || 1;
            const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];

            if (selectedOption && selectedOption.dataset.price) {
                const price = parseFloat(selectedOption.dataset.price);
                const total = price * quantity;
                document.getElementById('orderTotal').value = total.toFixed(2);
            }
        }

        // Form Submissions
        document.getElementById('customerForm').onsubmit = function(e) {
            e.preventDefault();
            const id = document.getElementById('customerId').value;
            const customer = {
                id: id ? parseInt(id) : nextCustomerId++,
                name: document.getElementById('customerName').value,
                phone: document.getElementById('customerPhone').value,
                email: document.getElementById('customerEmail').value,
                address: document.getElementById('customerAddress').value
            };

            if (id) {
                const index = customers.findIndex(c => c.id === parseInt(id));
                customers[index] = customer;
            } else {
                customers.push(customer);
            }

            saveData();
            loadCustomers();
            closeModal('customerModal');
            updateDashboard();
        };

        document.getElementById('serviceForm').onsubmit = function(e) {
            e.preventDefault();
            const id = document.getElementById('serviceId').value;
            const service = {
                id: id ? parseInt(id) : nextServiceId++,
                name: document.getElementById('serviceName').value,
                price: parseFloat(document.getElementById('servicePrice').value),
                duration: parseInt(document.getElementById('serviceDuration').value),
                description: document.getElementById('serviceDescription').value
            };

            if (id) {
                const index = services.findIndex(s => s.id === parseInt(id));
                services[index] = service;
            } else {
                services.push(service);
            }

            saveData();
            loadServices();
            closeModal('serviceModal');
        };

        document.getElementById('orderForm').onsubmit = function(e) {
            e.preventDefault();
            const id = document.getElementById('orderId').value;
            const order = {
                id: id ? parseInt(id) : nextOrderId++,
                customerId: parseInt(document.getElementById('orderCustomer').value),
                serviceId: parseInt(document.getElementById('orderService').value),
                quantity: parseInt(document.getElementById('orderQuantity').value),
                total: parseFloat(document.getElementById('orderTotal').value),
                status: document.getElementById('orderStatus').value,
                date: id ? orders.find(o => o.id === parseInt(id)).date : new Date().toISOString(),
                notes: document.getElementById('orderNotes').value
            };

            if (id) {
                const index = orders.findIndex(o => o.id === parseInt(id));
                orders[index] = order;
            } else {
                orders.push(order);
            }

            saveData();
            loadOrders();
            closeModal('orderModal');
            updateDashboard();
        };

        // Data Persistence
        function saveData() {
            localStorage.setItem('laundry_customers', JSON.stringify(customers));
            localStorage.setItem('laundry_services', JSON.stringify(services));
            localStorage.setItem('laundry_orders', JSON.stringify(orders));
            localStorage.setItem('next_customer_id', nextCustomerId.toString());
            localStorage.setItem('next_service_id', nextServiceId.toString());
            localStorage.setItem('next_order_id', nextOrderId.toString());
        }

        // Initialize
        updateDashboard();
        loadCustomers();
    </script>
