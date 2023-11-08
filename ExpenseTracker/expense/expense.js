const ul = document.getElementById("listofitems");

function savetolocaltostorage(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const email = event.target.email.value;
  const phonenumber = event.target.categories.value;
  const obj = {
    name,
    email,
    phonenumber,
  };
  const token = localStorage.getItem('token');
  axios
    .post("http://localhost:3000/expense/add-expense", obj, { headers: { "Authorization": token } })
    .then((response) => {
      console.log(response);
      ShowUserOnScreen(response.data.expense);
    })
    .catch((err) => {
      showError(err);
    });
}

function showpremiumusermessage() {
  document.getElementById('rzp-button1').style.visibility = "hidden";
  document.getElementById('message').innerHTML = "You Are a Premium User";
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}
let headingAdded = false;
function ShowUserOnScreen(expense) {
  if (expense && expense.name) {
    if (!headingAdded) {
      const h1 = document.createElement('h1');
      h1.textContent = 'Expenses';
      ul.appendChild(h1);
      headingAdded = true;
    }

    const li = document.createElement('li');
    li.innerHTML = `${expense.name} ${expense.email} ${expense.phonenumber}
      <button class="delete" onClick="deleteuser(${expense.id}, event)">Delete Product</button>`;
    ul.appendChild(li);
  }
}

function edituserdetails(email, name, category, userid) {
  document.getElementById('nameusertag').value = name;
  document.getElementById('emailusertag').value = email;
  document.getElementById('categories').value = category;
  deleteuser(userid);
}

function deleteuser(id, e) {
  const token = localStorage.getItem('token');
  axios.delete(`http://localhost:3000/expense/delete-expense/${id}`, { headers: { "Authorization": token } })
    .then((res) => {
      console.log(res.data.message);
      const li = e.target.parentElement;
      ul.removeChild(li);
    })
    .catch((err) => {
      showError(err);
    });
}

function showError(err) {
  console.error("Error:", err);
}

function showleaderboard() {
  const inputelement = document.createElement('input');
  inputelement.type = "button";
  inputelement.value = "Show Leaderboard";

  inputelement.onclick = async () => {
    const token = localStorage.getItem('token');
    const userleaderboardarray = await axios.get("http://localhost:3000/premium/showleaderboard", { headers: { "Authorization": token } });
    console.log(userleaderboardarray);
    var leaderboardelem = document.getElementById('leaderboard');
    leaderboardelem.innerHTML = ''; // Clear the content before adding new content

    leaderboardelem.innerHTML += `<h1>LeaderBoard</h1>`;
    userleaderboardarray.data.forEach((userdetails) => {
      leaderboardelem.innerHTML += `<li>Name-${userdetails.name} total expense-${userdetails.totalExpense || 0}</li>`;
    });
  }
  document.getElementById("message").appendChild(inputelement);
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');
  console.log('Token:', token); 
  const decodedtoken = parseJwt(token);
  console.log('Decoded Token:', decodedtoken);
  console.log(decodedtoken);
  const ispremiumuser = decodedtoken.ispremiumuser;
  
  if (ispremiumuser) {
    showpremiumusermessage();
    showleaderboard();
  }

  axios
    .get("http://localhost:3000/expense/get-expense", { headers: { "Authorization": token } })
    .then((response) => {
      response.data.expenses.forEach(expense => {
        ShowUserOnScreen(expense);
      });
    })
    .catch((err) => {
      showError(err);
    });
});

document.getElementById('rzp-button1').onclick = async function (e) {
  const token = localStorage.getItem('token');
  const response = await axios.get("http://localhost:3000/purchase/premiummembership", { headers: { "Authorization": token } });
  console.log(response);
  var options = {
    "key": response.data.key_id,
    "order_id": response.data.order.id,
    "handler": async function (response) {
      console.log('Premium purchase successful');
      const res=await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,
      }, { headers: { "Authorization": token } });
      alert('You are a premium user now');
      document.getElementById('rzp-button1').style.visibility = "hidden";
      document.getElementById('message').innerHTML = "You Are a Premium User";
      console.log(res.data.token)
      localStorage.setItem('token', res.data.token);

      console.log('Before calling showleaderboard()');
      showleaderboard();
    }
  }
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
  rzp1.on('payment.failed', function (response) {
    console.log(response);
    alert('something went wrong');
  });
}
