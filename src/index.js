(async function () {
  const data = await fetch("./src/data.json");
  const res = await data.json();
  console.log(res);

  let employees = res;
  let selectedEmployeeId = employees[0].id;
  let selectedEmployee = employees[0];

  const employeeList = document.querySelector(".employees__names--list");
  const employeeInfo = document.querySelector(".employees__single--info");

  const createEmployee = document.querySelector(".createEmployee");
  const addEmployeeModal = document.querySelector(".addEmployee");
  const addEmployeeForm = document.querySelector(".addEmployee_create");

  // create employee logic
  createEmployee.addEventListener("click", () => {
    addEmployeeModal.style.display = "flex";
  });

  addEmployeeModal.addEventListener("click", (e) => {
    if (e.target.className === "addEmployee") {
      addEmployeeModal.style.display = "none";
    }
  });

  // logic for employee age selection above 18 years from now
  const dobInput = document.querySelector(".addEmployee_create--dob");
  dobInput.max = `${new Date().getFullYear() - 18}-${new Date()
    .toISOString()
    .slice(5, 10)}`;

  const dd = new Date().getFullYear() - 18;
  console.log(dd);

  // Add employee logic
  addEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addEmployeeForm);
    const values = [...formData.entries()];
    console.log(values);
    let empData = {};
    values.forEach((val) => {
      empData[val[0]] = [val[1]];
    });

    empData.id = employees[employees.length - 1].id + 1;
    console.log("id", empData.id);
    empData.age =
      new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
    empData.imageUrl =
      empData.imageUrl || "https://cdn-icons-png.flaticon.com/512/0/93.png";
    employees.push(empData);
    renderEmployee();
    addEmployeeForm.reset();
    addEmployeeModal.style.display = "none";
  });

  //select employee logic
  employeeList.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
      selectedEmployeeId = e.target.id;
      renderEmployee();
      renderSingleEmployee();
    }

    // deleteing
    if (e.target.tagName === "I") {
      employees = employees.filter(
        (emp) => String(emp.id) !== e.target.parentNode.id
      );
      if (String(selectedEmployeeId) === e.target.parentNode.id) {
        selectedEmployeeId = employees[0]?.id || -1;
        selectedEmployee = employees[0] || {};
        renderSingleEmployee();
      }
      renderEmployee();
    }
  });

  // render employee logic
  const renderEmployee = () => {
    employeeList.innerHTML = "";
    employees.forEach((e) => {
      const emp = document.createElement("span");
      emp.classList.add("employees__names--item");

      if (parseInt(selectedEmployeeId, 10) === e.id) {
        emp.classList.add("selected");
        selectedEmployee = e;
      }
      emp.setAttribute("id", e.id);
      emp.innerHTML = `${e.firstName} ${e.lastName}  <i class="employeeDelete">❌</i>`;
      employeeList.append(emp);
    });
  };

  // render single employee logic
  const renderSingleEmployee = () => {
    if (selectedEmployeeId === -1) {
      employeeInfo.innerHTML = "";
      return;
    }

    employeeInfo.innerHTML = `
    <img src="${selectedEmployee.imageUrl}"/>
    <span class="employees__single--heading">
    ${selectedEmployee.firstName} ${selectedEmployee.lastName}
    (${selectedEmployee.age})
    </span>
    <span>${selectedEmployee.address}</span>
    <span>${selectedEmployee.email}</span>
    <span>Mobile - ${selectedEmployee.contactNumber}</span>
    <span>DOB - ${selectedEmployee.dob}</span>
    <span>Salary AUD - ${selectedEmployee.salary}</span>
    `;
  };
  renderEmployee();
  if (selectedEmployee) renderSingleEmployee();
})();
