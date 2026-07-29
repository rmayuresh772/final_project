export default function PendingExpenses({expenses}:any){


return (

<div className="bg-white rounded-2xl shadow-sm border p-6">


<h2 className="
text-xl
font-bold
text-slate-900
mb-6
">
Pending Approval
</h2>


<div className="space-y-4">


{
expenses.map((expense:any)=>(


<div
key={expense.id}
className="border rounded-xl p-4"
>


<div className="flex justify-between">


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
">
{expense.user.name}
</p>

</div>


<p className="
font-bold
text-slate-900
">
${expense.amount}
</p>


</div>



<div className="flex gap-3 mt-4">


<button
className="
flex-1
bg-green-600
text-white
rounded-lg
py-2
text-sm
hover:bg-green-700
"
>
Approve
</button>


<button
className="
flex-1
bg-red-50
text-red-600
rounded-lg
py-2
text-sm
hover:bg-red-100
"
>
Reject
</button>


</div>


</div>


))

}


</div>


</div>


)

}