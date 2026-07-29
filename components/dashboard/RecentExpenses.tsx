type Props = {
  expenses:any[];
};


export default function RecentExpenses({expenses}:Props){


return (

<div className="
bg-white
rounded-2xl
border
shadow-sm
p-6
">


<div className="
flex
justify-between
items-center
mb-6
">

<h2 className="
text-xl
font-bold
text-slate-900
">
Recent Expenses
</h2>


<button
className="
text-blue-600
font-medium
hover:underline
"
>
View all
</button>

</div>



<div className="space-y-4">


{
expenses.map((expense)=>(

<div
key={expense.id}
className="
flex
justify-between
items-center
border
rounded-xl
p-5
hover:shadow-sm
transition
"
>


<div>


<h3 className="
font-semibold
text-slate-900
">
{expense.title}
</h3>


<p className="
text-sm
text-slate-500
mt-1
">
{expense.category}
</p>


</div>



<div className="
text-right
">


<p className="
font-bold
text-slate-900
">
${expense.amount}
</p>


<span
className={`
inline-block
mt-2
px-3
py-1
rounded-full
text-xs
font-medium

${
expense.status==="APPROVED"
?
"bg-green-100 text-green-700"
:
expense.status==="REJECTED"
?
"bg-red-100 text-red-700"
:
"bg-yellow-100 text-yellow-700"
}

`}
>

{expense.status}

</span>


</div>


</div>


))
}


</div>


</div>


)

}