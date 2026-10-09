console.log("=================College Canteen====================");

const matrix = [
    ["Samosa", 15, 3],
    ["Tea", 10, 2],
    ["Sandwich", 40, 1]
];

// 1. Define functions first so they are available when called
function itemTotal(a, b) {
    const result = a * b;
    return result;
}

const addGST = (amount) => amount * 1.05;
const applyDiscount = (amount, discount) => amount - (amount * discount / 100);

// 2. Loop to print items and calculate SubTotal
let subTotal = 0;

for (let i = 0; i < matrix.length; i++) {
    const total = itemTotal(matrix[i][1], matrix[i][2]);
    console.log(matrix[i][0] + ": " + total);    
    subTotal += total; // Combines your two previous loops into one efficient loop
}

console.log("----------------------------------------------------");
console.log("SubTotal: " + subTotal);

const totalWithGST = addGST(subTotal);
console.log("Total with GST: " + totalWithGST);

// Example: Applying a 10% student discount to the final bill
const studentDiscountPercent = 10; 
const finalBill = applyDiscount(totalWithGST, studentDiscountPercent);
console.log("Final Bill (10% Discount): " + finalBill.toFixed(2));
console.log("====================================================");
