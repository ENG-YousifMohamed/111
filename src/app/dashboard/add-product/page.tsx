'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/actions/productActions';
import Link from 'next/link';

export default function AddProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // دالة التعامل مع زرار الحفظ
    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const res = await createProduct(formData);
        
        if (res.success) {
            alert('✅ تم إضافة المنتج بنجاح!');
            router.push('/dashboard'); // هيرجعك للداش بورد أوتوماتيك
        } else {
            alert('❌ حصل خطأ أثناء الإضافة');
            setIsLoading(false);
        }
    }

    return (
        <div dir="rtl" className="min-h-screen bg-[#050505] text-white p-8 font-sans">
            <div className="max-w-2xl mx-auto">
                {/* الهيدر */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            إضافة منتج جديد 📦
                        </h1>
                        <p className="text-gray-400 mt-2">قم بإدخال تفاصيل المنتج ليتم إضافته للمخزون.</p>
                    </div>
                    <Link href="/dashboard" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all text-sm">
                        ← رجوع للداش بورد
                    </Link>
                </div>

                {/* الفورم */}
                <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 shadow-2xl">
                    <form action={handleSubmit} className="space-y-6">
                        
                        {/* اسم المنتج */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">اسم المنتج <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                name="name" 
                                required 
                                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                placeholder="مثال: اسم المنتج"
                            />
                        </div>

                        {/* السعر والمخزون في سطر واحد */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">السعر ($) <span className="text-red-500">*</span></label>
                                <input 
                                    type="number" 
                                    name="price" 
                                    required 
                                    min="0"
                                    step="0.01"
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">الكمية (المخزون) <span className="text-red-500">*</span></label>
                                <input 
                                    type="number" 
                                    name="stock" 
                                    required 
                                    min="0"
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    placeholder="مثال: 50"
                                />
                            </div>
                        </div>

                        {/* الوصف */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">وصف المنتج</label>
                            <textarea 
                                name="description" 
                                rows={4}
                                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                placeholder="اكتب تفاصيل ومميزات المنتج هنا..."
                            ></textarea>
                        </div>

                        {/* زرار الإرسال */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                                isLoading 
                                ? 'bg-gray-600 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02]'
                            }`}
                        >
                            {isLoading ? 'جاري الإضافة... ⏳' : '➕ إضافة المنتج لقاعدة البيانات'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
