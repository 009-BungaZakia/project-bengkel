// import React, { useState } from "react";
// import { ShoppingBag, Package, Info, X, ChevronRight } from "lucide-react";

// export default function ProductCatalog() {
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const products = [
//     { 
//       id: 1, 
//       name: "Oli Mesin SPX 2", 
//       price: 65000, 
//       desc: "Matic 0.8L - Performa Maksimal", 
//       longDesc: "Oli mesin resmi AHM khusus motor matic. Melindungi mesin dari gesekan berlebih dan menjaga suhu tetap stabil.",
//       color: "bg-orange-500" 
//     },
//     { 
//       id: 2, 
//       name: "Kampas Rem Depan", 
//       price: 45000, 
//       desc: "Non-Asbestos - Pakem & Awet", 
//       longDesc: "Suku cadang asli untuk pengereman yang lebih responsif. Tidak merusak piringan cakram dan tahan panas tinggi.",
//       color: "bg-blue-500" 
//     },
//     { 
//       id: 3, 
//       name: "Ban Tubeless", 
//       price: 215000, 
//       desc: "Ring 14 - Anti Slip", 
//       longDesc: "Didesain dengan kompon khusus untuk cengkraman maksimal di jalan basah maupun kering.",
//       color: "bg-slate-800" 
//     },
//     { 
//       id: 4, 
//       name: "V-Belt Kit", 
//       price: 185000, 
//       desc: "Set Roller + Belt", 
//       longDesc: "Mengembalikan akselerasi motor matic Anda. Tahan lama dan mencegah risiko putus di tengah jalan.",
//       color: "bg-amber-500" 
//     },
//   ];

//   return (
//     <section className="mt-12">
//       <div className="flex justify-between items-end mb-6">
//         <div>
//           <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
//             <ShoppingBag className="text-blue-600" /> Katalog Sparepart
//           </h3>
//           <p className="text-sm text-slate-500 font-medium font-mono uppercase tracking-tighter">Suku Cadang Asli & Rekomendasi</p>
//         </div>
//       </div>

//       {/* Grid Produk */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {products.map((p) => (
//           <div 
//             key={p.id} 
//             onClick={() => setSelectedProduct(p)}
//             className="group bg-white p-5 rounded-[32px] border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
//           >
//             <div className={`w-full h-40 ${p.color} rounded-2xl mb-4 flex items-center justify-center text-white relative overflow-hidden shadow-inner`}>
//               <Package size={48} className="opacity-30 group-hover:scale-110 transition-transform duration-500" />
//               <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
//                 <Info size={16} />
//               </div>
//             </div>
//             <h4 className="font-black text-slate-800 leading-tight mb-1">{p.name}</h4>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">{p.desc}</p>
//             <div className="flex justify-between items-center border-t border-slate-50 pt-3">
//               <p className="font-black text-blue-600 text-lg">Rp {p.price.toLocaleString('id-ID')}</p>
//               <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
//                 <ChevronRight size={18} />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal Detail */}
//       {selectedProduct && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
//           <div className="relative bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
//             <div className={`h-48 ${selectedProduct.color} flex items-center justify-center text-white`}>
//                <Package size={80} className="opacity-40" />
//             </div>
//             <div className="p-8">
//               <div className="flex justify-between items-start mb-4">
//                 <h2 className="text-2xl font-black text-slate-800">{selectedProduct.name}</h2>
//                 <button onClick={() => setSelectedProduct(null)} className="p-2 bg-slate-100 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors">
//                   <X size={20} />
//                 </button>
//               </div>
//               <p className="text-blue-600 font-black text-xl mb-4">Rp {selectedProduct.price.toLocaleString('id-ID')}</p>
//               <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6">
//                 <p className="text-slate-600 text-sm leading-relaxed">{selectedProduct.longDesc}</p>
//               </div>
//               <button onClick={() => setSelectedProduct(null)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all">
//                 Tutup Detail
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }