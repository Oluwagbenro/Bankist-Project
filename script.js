'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML=' ';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements

  movs.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}
// displayMovements(account1.movements)

const calcDisplayBalance = function (acc){
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance 
  labelBalance.textContent=`${acc.balance} EUR`;
}
// calcDisplayBalance(account1.movements)

const calcDisplaySummary = function (acc){
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}EUR`

  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}EUR`

  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * acc.interestRate))
  .filter((int, i, arr) => {
    console.log(arr); 
    return int>=1;
  })
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}EUR`
}
// calcDisplaySummary(account1.movements)






// ====================USE CASE OF MAP LOOPING==========
const createUsernames = function(accs){
  accs.forEach(function(acc){
      acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function(name){ // This name points to each element inside the array
        return name[0];
      }).join('');
  })
}
// username.map(function(name){
//   return name[0];
// })
createUsernames(accounts);
// console.log(accounts)
// console.log(account4.owner)

const updateUI = function (acc){
  //Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
calcDisplaySummary(acc)

}

//========EVENT HANDLER========
let currentAccount;

btnLogin.addEventListener('click', function(e){
  //Prevent from submitting
  e.preventDefault();

currentAccount = accounts.find( acc => acc.username === inputLoginUsername.value);
// console.log(currentAccount)

if(currentAccount?.pin === Number(inputLoginPin.value)){
  //Display UI and message
  labelWelcome.textContent =` Welcome back, ${currentAccount.owner.split(' ')[0]
}`;
containerApp.style.opacity=100
// Clear input fields
inputLoginUsername.value=inputLoginPin.value= ''
inputLoginPin.blur( );

//Update UI
  updateUI(currentAccount)
}
})

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';

  if(
    amount > 0 &&  
    receiverAcc &&
    currentAccount.balance>= amount && 
    receiverAcc?.username !== currentAccount.username) {

      //Doing the transfer
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      // Update UI
      updateUI(currentAccount)
    }
})
// console.log('Transfer Valid')

btnClose.addEventListener('click', function(e){
  e.preventDefault();

  const closeUsername = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);

  if(
    currentAccount.username === closeUsername &&
    currentAccount.pin === closePin
  ){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    console.log(index)

    // Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacityc = 0;
  }
  closeUsername = closePin = '';
});

btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1 )) {
    // Add movement 
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount)
  }
  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted)
  sorted = !sorted;
})







// ===============USE CASE OF FILTER LOOPING=============
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposit = movements.filter(function(mov, i, arr){
//   return mov>0;
// })
// console.log(deposit)

// const withdrawal = movements.filter(function(el){
//   return el < 0;
// })
// console.log(withdrawal)


// ===============REDUCE METHOD OF LOOPING=========

// Accumulator is like a snowball accepting all the elements together 
// const balance = movements.reduce(function(accumulator, curr, i, arr){
//   console.log(`Iteration ${i}: ${accumulator}`);
//     return accumulator + curr;
// }, 0);
//Arrow version
// const balance = movements.reduce((accumulator, curr) => accumulator + curr, 0);

// console.log(balance)
// let sum =0;
// for ( let i=0; i<movements.length; i++)
//   sum+=movements[i];
//   console.log(sum)

// let balance2 = 0;
// for(const mov of movements) balance2 += mov;
// console.log(balance2);

//=================MAXIMUM VALUE==============
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const max = movements.reduce(function(acc, mov){
//   if(acc > mov){
//     return acc;
//   } else{
//     return mov;
//   }
// }, movements[0]);

// console.log(movements)
// console.log(max)

//============CHALLENGE 2 ============

// TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
// TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

//   const data1 = [5, 2, 4, 1, 15, 8, 3];
//   const data2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = function(ages){
//   // const value= ages.map(el => (el <= 2 ? 2*el : 16+ el*4))
//   const value= ages.map(function(el){
//     if( el <= 2){
//       return el *2
//     } else{
//       return 16 + el*4
//     }
// });
//     console.log(value)

//     const above18 = value.filter(function(el){
//       return el > 18
//     })
//     console.log(above18)

//     // const average = above18.reduce((acc, el) => acc + el, 0) / above18.length;


//     const average = above18.reduce(function(acc, el, i, arr){
//       return  acc + el / above18.length;
//     }, 0);

//     // let sum = 0;
//     // for(const [i, el] of above18.entries)
//     // sum+=el
//     // console.log(sum);

//     console.log(average)
  
// }

// calcAverageHumanAge(data1);

// console.log(`------2-------`)
// calcAverageHumanAge(data2);

// //==========Challenge 3 on Map chaining==========
// const data1 = [5, 2, 4, 1, 15, 8, 3];
// const data2 = [16, 6, 10, 5, 6, 1, 4];
// const calcAverageHumanAge = ages =>
//   ages
//   .map(el => (el <= 2 ? 2*el : 16+ el*4))
//   .filter((el) => el > 18
//         )
//   .reduce((acc, el, i, arr) => acc + el/arr.length, 0);
// const avg1= calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3])
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4])
// console.log(avg1, avg2)


// =========== CHALLENGE 1 ===========
// TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

// const dogsJulia1 = [3, 5, 2, 12, 7];
// const dogsKate1 = [4, 1, 15, 8, 3];

// const dogsJulia2 = [9, 16, 6, 8, 3];
// const dogsKate2 = [10, 5, 6, 1, 4];

// const checkDogs = function(julia, kate){
//   const juliaDog = julia.slice();
//   juliaDog.splice(0, 1);
//   juliaDog.splice(-2);
//   //juliaDog.slice(1,3)

//   const correctData =[...juliaDog, ...kate];
//   // const correctData = juliaDog.concat(kate);
//   console.log(juliaDog, correctData);

//   correctData.forEach(function(el, i){
//     if(el>=3){
//       console.log(`Dog number ${i + 1} is an adult, and is ${el} years 👨‍🦰`)
//     } else{
//       console.log(`Dog number ${i + 1} is still a puppy 🐶`)
//     }
//   })
// }

// checkDogs(dogsJulia1,dogsKate1)
// checkDogs(dogsJulia2,dogsKate2)




/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// // const currencies = new Map([
// //   ['USD', 'United States dollar'],
// //   ['EUR', 'Euro'],
// //   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


// let arr = ['a', 'b', 'c', 'd', 'e', 'f'];

// //SLICE
// console.log(arr.slice(1, -3));
// console.log(arr.slice(1, -2));
// console.log(arr.slice(-4))
// console.log(arr.slice()); // Shallow copy of the array
// console.log([...arr]);

// //SPLICE -This mutate/delete certain element from the array

// arr.splice(-1)
// console.log(arr)
// arr.splice(1, 2)
// console.log(arr)

// //REVERSE -- It's important to note that the reverse method mutate the original array to the new content of the reverse call.
// arr = ['a', 'b', 'c', 'd', 'e', 'f'];
// const arr2 =[ 'j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);


// ===============CONCAT========================
// const letters = arr.concat(arr2);
// console.log([...arr, ...arr2]);

// // JOIN
// console.log(letters.join(' - '));


// ================FOR EACH METHOD===================
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for ( const [i, movement] of movements.entries()){
//   // console.log(`${i}   ${arr}`)
//   if(movement > 0){
//     console.log(`You deposited ${movement}`)
//   } else{ 
//     console.log(`You withdrew ${Math.abs(movement)}`)}
// }
// console.log('--------FOREACH-------')

// movements.forEach (function(move, i, arr){
// // console.log(`${move}  ${i}  ${arr}`)

//   if(move > 0){
//     console.log(`You deposited ${move}`)
//   } else{ 
//     console.log(`You withdrew ${Math.abs(move)}`)}
// })


//====================MAP=====================
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
// currencies.forEach(function(value, key, map){
//   console.log(`${key}: ${value}`)
// })


// ===================FOR EACH IN SET====================
// const currenciesUnique = new Set(['USD', 'GBP', 'USD','EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function(element, key, Set){
//   console.log(`${key}: ${element}`)
// })


// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const euroToUsd = 1.1

// const movementsUSD = movements.map(function(mov){
//   return mov * euroToUsd;
// })
// // const movementsSD = movements.map (mov => mov * euroToUsd);
// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = []
// for( const mov of movements)
// movementsUSDfor.push(mov * euroToUsd);
// console.log(movementsUSDfor);

//========BANKIST APP


//=========Magic of chaining Methods======
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const euroToUsd = 1.1;

// // PIPELINE
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   // .map(mov => mov * euroToUsd)
//   .map((mov, i, arr)=>{
//     console.log(arr)
//     return mov * euroToUsd
//   })
//   .reduce((acc, mov) => acc + mov, 0)

// console.log(totalDepositsUSD)

// ============FIND METHOD ============

// const firstWithdrawal = movements.find(mov => mov< 0)

// console.log(movements)
// console.log(firstWithdrawal)


// const account = accounts.find(acc => acc.owner ==='Jessica Davis')

// console.log(account);

// ========= SOME METHOD============
//Equality
console.log(movements.includes(-130));

//Condition
console.log(movements.some(mov => mov === -130));


const anyDeposits = movements.some(mov => mov > 0); console.log(anyDeposits);


//========EVERY METHOD=========

console.log(movements.every(mov => mov > 0))
console.log(account4.movements.every(mov => mov > 0));

//Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

// ======= Flat =======
//The flat method only goes one level deep in the array 
const arr = [[1,2,3], [4,5,6], 7, 8];
console.log(arr.flat());

// const arrDeep = [[[1,2], 3], [4, [5,6]], 7, 8];
// console.log(arrDeep.flat())

const arrDeep = [[[1,2], 3], [4, [5,6]], 7, 8];
console.log(arrDeep.flat(2)) //Depth in Flat

// const accountMovements = accounts.map(acc => acc.movements)
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);

// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance)
//====Chaining Method====
// const overalBalance = accounts
// .map(acc => acc.movements)
// .flat()
// .reduce((acc,mov) => acc + mov, 0);
// console.log(overalBalance);

// //=====FLATMAP=====

// //Since map method is used before flat, which is generally a common practise in programming, flatMap method is another alternative can be used

// const overBalance2 = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);
// console.log(overBalance2);

// ===========SORTING ARRAYS==========
    // Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners) // Sorting has mutated the original array 

//Numbers
console.log(movements)
// console.log(movements.sort()); //Sorting basically is done on Strings 

// return < 0, A, B
// return > 0, B, A

//========= Ascending ==========
// movements.sort((a, b) => {
//   if(a > b) return 1; // (Keep order )
//   if (a < b) return -1; // (switch order by -1)
// })
movements.sort((a, b) => a - b);
console.log(movements);
//========== Descending ============
// movements.sort((a, b) => {
//   if(a > b) return -1; // (switch order by -1)
//   if (a < b) return 1; // (Keep order )
// })
movements.sort((a, b) => b - a);
console.log(movements);

//More ways of creating and filling arrays

//Manual creation
console.log([1,2,3,4,5,6,7])
console.log(new Array(1,2,3,4,5,6,7));

// Empty arrays + fill method
const x = new Array(7);
console.log(x);
console.log(x.map (() => 5)); // this will not work.

x.fill(1, 3);
console.log(x)

// comparison
// const slice = ([1,2,3,4,5,6,7])
// console.log(slice.slice(1, 4))
// console.log(slice.splice(1, 4))

// Recreate Array - array.from
const y = Array.from({length: 7}, () => 1);
console.log(y)

const z = Array.from({length: 7}, (_, i) => i + 1); // We also have access to the index just like in map and find method.
console.log(z);

// const b = Array.from({length: 100}, () => Math.trunc((Math.random() * 100 +1)))
// console.log(b)

labelBalance.addEventListener('click', function(){
  // The map method will work on the Array.from because it created an array for all the element selected,  without the Array.from method, map will never work, because the elements will never be in an array.
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),el => Number(el.textContent.replace('EUR', ''))
  )
  console.log(movementsUI) 

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
});

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

// 1.
const foody = function(dogs){
  dogs.forEach((el) => (
    el.recFood = Math.trunc(el.weight ** 0.75 *28))
  )
}
foody(dogs)
console.log(dogs)

// 2.

const dogSarah = dogs.find(el => el.owners.includes('Sarah'))
console.log(dogSarah)
console.log(`Sarah's dog is eating too ${dogSarah.curFood > dogSarah.recFood ? 'Much' : 'Little'}`)

// 3.
const ownersEatTooMuch = dogs
.filter(el => el.curFood > el.recFood)
.flatMap(el => el.owners);
console.log(ownersEatTooMuch)

const ownersEatTooLittle = dogs
.filter( el => el.curFood < el.recFood)
.flatMap(el => el.owners )
console.log(ownersEatTooLittle)


// 4. 
// "Matilda and Alice and Bob's dogs eat too much!"
// "Sarah and John and Michael's dogs eat too little!"
console.log(`${ownersEatTooMuch.join(' and ')} dogs eat too much`)
console.log(`${ownersEatTooLittle.join(' and ')} dogs eat too little`)

// 5.
// console.log(`${dogs.curFood === dogs.recFood ? 'True' : False }`)
console.log(dogs.some(dog => dog.curFood === dog.recFood))

// 6.
const checkEatingOkay = dog => dog.curFood > (dog.recFood * 0.90) && dog.curFood < (dog.recFood * 1.10)
console.log(dogs.some(checkEatingOkay));

// 7

const okay = dogs.filter(checkEatingOkay)
console.log(okay)

// 8

const dogs2 = dogs.slice().sort((a,b) =>
  a.recFood - b.recFood
)
console.log(dogs2);
