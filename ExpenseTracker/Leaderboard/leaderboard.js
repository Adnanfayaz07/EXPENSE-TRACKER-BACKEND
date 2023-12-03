axios.get('http://54.81.91.216:3000/premium/showleaderboard').then((res) => {
    const leaderboardData = res.data;

    const tbody = document.querySelector('#tbody')
    let position = 1
    
    for(let details of leaderboardData){
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${position++}</td>
            <td>${details.name}</td>
            <td>${details.totalExpenses}</td>
        `
        tbody.appendChild(tr);
    }
}).catch((error) => {
    if ( error.response.data.error) {
        
        alert(error.response.data.error);
    } else {

        console.error(error);
    }
  });