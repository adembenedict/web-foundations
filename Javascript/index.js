let variable ="Peter Karanja"
const variable_2 ="Ben Jude"
 
// data types
// sting -"Peter Karanja"
//number - 123
// boolean - true
// array -[0,1,2]
//object -{name: "Peter Karanja"}
//null - null = zero
//undefined - undefined 

// Operators
// arthimetic operators +,-,*,%
//comparison operators == === != < > <= >=
//logical && || !
//assignment = += -= *= %= /=
//ternary ? :
//type operators typeof intanceof 


let bank_balance = 2000;
const fuliza_limit =200;


const can_fuliza =(amount)=> {
    if (amount > fuliza_limit){
        return "I am sorry,you can not fuliza"
    }
    else
    { return "You can fuliza"}
}



console.log(`Hello Chico, ${can_fuliza(1000)}`);