type Props = {
  data: {
    totalExpenses:number;
    draft:number;
    submitted:number;
    approved:number;
    rejected:number;
    totalAmount:string;
  };
};


export default function SummaryCards({data}:Props){


const cards = [
{
 title:"Total Expenses",
 value:data.totalExpenses,
 icon:"📄",
 bg:"bg-blue-50"
},
{
 title:"Draft",
 value:data.draft,
 icon:"📝",
 bg:"bg-purple-50"
},
{
 title:"Submitted",
 value:data.submitted,
 icon:"⏳",
 bg:"bg-yellow-50"
},
{
 title:"Approved",
 value:data.approved,
 icon:"✅",
 bg:"bg-green-50"
},
{
 title:"Rejected",
 value:data.rejected,
 icon:"❌",
 bg:"bg-red-50"
},
{
 title:"Total Amount",
 value:`$${data.totalAmount}`,
 icon:"💵",
 bg:"bg-indigo-50"
}

]


return (

<div className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-6
gap-5
">


{
cards.map((card)=>(
<div
key={card.title}
className="
bg-white
rounded-2xl
border
shadow-sm
p-6
hover:shadow-md
transition
"
>


<div className={`
w-12 h-12
rounded-xl
flex
items-center
justify-center
text-xl
${card.bg}
`}>
{card.icon}
</div>


<p className="
mt-5
text-sm
font-medium
text-slate-500
">
{card.title}
</p>


<h2 className="
mt-2
text-3xl
font-bold
text-slate-900
">
{card.value}
</h2>


</div>
))
}


</div>

)

}