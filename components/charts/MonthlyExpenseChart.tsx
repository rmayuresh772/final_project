"use client";

import {
BarChart,
Bar,
LabelList,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid
} from "recharts";


type Props={
data:{
month:string;
total:number;
}[];
}


export default function MonthlyExpenseChart({data}:Props){


console.log("CHART DATA:",data);


return (

<div className="
bg-white
rounded-2xl
border
shadow-sm
p-6
h-[420px]
">


<h2 className="
text-lg
font-semibold
text-slate-900
mb-6
">
Monthly Expenses
</h2>



<ResponsiveContainer width="100%" height="85%">


<BarChart
data={data}
barCategoryGap="40%"
>


<CartesianGrid
strokeDasharray="3 3"
/>


<XAxis

dataKey="month"

tick={{
fill:"#334155",
fontSize:14
}}

/>


<YAxis

tick={{
fill:"#334155",
fontSize:14
}}

/>


<Tooltip

contentStyle={{
background:"#fff",
borderRadius:"12px",
border:"1px solid #e2e8f0"
}}

/>


<Bar
dataKey="total"
fill="#2563eb"
barSize={80}
radius={[10,10,0,0]}
>

<LabelList
dataKey="total"
position="top"
fill="#0f172a"
/>

</Bar>


</BarChart>


</ResponsiveContainer>


</div>

)

}