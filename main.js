// VARIABLES

const newPayrollBtn = document.getElementById("newPayroll");
let crew = [];

// EVENT LISTENER

newPayrollBtn.addEventListener("click", () => {
  const payrollTable = document.getElementById("payrollTable");
  payrollTable.style.display = "table";
  newPayrollBtn.style.display = "none";
});

// FUNCTIONS

const loadEmployees = async () => {
  try {
    const response = await fetch("/employees.json");
    crew = await response.json();
    displayEmployees(crew);
  } catch (e) {
    console.error(e);
  }
};

const displayEmployees = (employees) => {
  const employeesTable = employees
    .map((employee) => {
      const { id, firstName, lastName, hourlyWage } = employee;
      return `
        <tr>
         <th scope="row">${id}</th>
          <td>${firstName}</td>
          <td>${lastName}</td>
          <td>${hourlyWage}</td>
          <td><input type="number" class="hours-worked" style="width:60px;" min="0"/> h</td>
          <td class="monthly-pay fw-bold"></td>
        </tr>
        `;
    })
    .join("");
  document.getElementById("employees-table").innerHTML = employeesTable;
  monthlyPay();

  const getEmployeesHourlyWage = employees.map(
    (employee) => employee.hourlyWage
  );

  let maxHourlyWage = calculateMaxWage(getEmployeesHourlyWage);
  document.getElementById("max-wage").innerText = "$" + maxHourlyWage;

  let minHourlyWage = calculateMinWage(getEmployeesHourlyWage);
  document.getElementById("min-wage").innerText = "$" + minHourlyWage;

  const getTotal = (total, hourlyWage) => total + hourlyWage;

  const getAverageHourlyWage = (array) =>
    array.reduce(getTotal, 0) / array.length;
  let averageHourlyWage = getAverageHourlyWage(getEmployeesHourlyWage).toFixed(
    2
  );
  document.getElementById("avg-wage").innerText = "$" + averageHourlyWage;
};

loadEmployees();

const monthlyPay = () => {
  const hourlyWage = document.querySelectorAll(".hours-worked");
  hourlyWage.forEach((hourWorked) => {
    hourWorked.addEventListener("keyup", (e) => {
      if (e.target.value === "" || e.target.value <= 0) {
        return;
      } else {
        if (e.key === "Enter") {
          const hour = e.target.value;
          const hourlyWage = Number(
            e.target.parentElement.parentElement.children[3].innerText.substring(
              1
            )
          );
          let monthlyPayment = e.target.parentElement.parentElement.children[5];
          const calculateMonthlyPay = (hour * hourlyWage).toFixed(2);
          monthlyPayment.innerText = "$" + calculateMonthlyPay;
          saveData(hour);
        }
      }
    });
  });
};

// HELPER FUNCTIONS

const calculateMaxWage = (array) => {
  return Math.max(...array);
};

const calculateMinWage = (array) => {
  return Math.min(...array);
};

const calculateTotal = (total, number) => {
  return total + number;
};

// SAVING DATA

const saveData = (hour) => {
  let hours;
  if (localStorage.getItem("hours") === null) {
    hours = [];
  } else {
    hours = JSON.parse(localStorage.getItem("hours"));
  }
  hours.push(hour);
  localStorage.setItem("hours", JSON.stringify(hours));

  const h = hours.map((hour) => parseInt(hour));
  let totalHours = h.reduce(calculateTotal, 0);

  document.getElementById("total-working-hours").innerText = totalHours + "h";
};

// TOTAL

const getTotalPayouts = () => {
  const monthlyPays = document.querySelectorAll(".monthly-pay");
  let arrayOfPayouts = Array.from(monthlyPays);

  let newPayout = arrayOfPayouts.map((payOut) =>
    parseFloat(payOut.innerHTML.substring(1))
  );

  newPayout = newPayout.filter((payout) => payout);

  let calculateTotalPay = newPayout.reduce(calculateTotal, 0);
  document.getElementById("total-monthly-pay").innerText =
    "$" + calculateTotalPay.toFixed(2);
};
