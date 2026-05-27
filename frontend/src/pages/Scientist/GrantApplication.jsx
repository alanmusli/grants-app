import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationApi } from '../../api/applicationApi'; // Uncomment when ready to connect

export default function GrantApplication() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        conferenceName: '',
        paperTitle: '',
        destination: '',
        travelDate: '',
        estimatedCosts: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await applicationApi.submitApplication(formData);
            alert("Апликацијата е успешно поднесена!");
            navigate('/dashboard');
        } catch (error) {
            console.error("Грешка при поднесување", error);
            alert("Настана грешка.");
        }
    };

    // This is the magic CSS string that makes all text inputs look identical and highly visible
    const inputClasses = "w-full mt-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all";

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Апликација за Научен Грант</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Conference Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Име на конференција *</label>
                    <input 
                        type="text" 
                        name="conferenceName" 
                        required
                        className={inputClasses}
                        placeholder="на пр. IEEE International Conference on AI"
                        onChange={handleChange}
                    />
                </div>

                {/* Paper Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Наслов на прифатениот труд *</label>
                    <input 
                        type="text" 
                        name="paperTitle" 
                        required
                        className={inputClasses}
                        placeholder="Внесете го точниот наслов на трудот"
                        onChange={handleChange}
                    />
                </div>

                {/* Destination */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Дестинација (Држава, Град) *</label>
                    <input 
                        type="text" 
                        name="destination" 
                        required
                        className={inputClasses}
                        placeholder="на пр. Rome, Italy"
                        onChange={handleChange}
                    />
                </div>

                {/* Date & Costs Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Датум на патување *</label>
                        <input 
                            type="date" 
                            name="travelDate" 
                            required
                            className={inputClasses}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Проценети трошоци (MKD) *</label>
                        <input 
                            type="number" 
                            name="estimatedCosts" 
                            required
                            className={inputClasses}
                            placeholder="0.00"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* File Upload (Custom styled for Tailwind) */}
                <div className="pt-4 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Прикачете документи (Покана, Прифатен труд)</label>
                    <input 
                        type="file" 
                        multiple
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2.5 file:px-4
                            file:rounded-lg file:border-0
                            file:text-sm file:font-semibold
                            file:bg-[#003366] file:text-white
                            hover:file:bg-[#002244] file:transition-colors file:cursor-pointer
                            bg-gray-50 border border-gray-200 rounded-lg p-2"
                    />
                    <p className="mt-2 text-xs text-gray-500">Дозволени формати: .pdf, .docx, .jpg | Макс: 10MB по фајл</p>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                    <button 
                        type="submit" 
                        className="w-full bg-[#003366] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#002244] transition-colors shadow-md"
                    >
                        Поднеси Апликација
                    </button>
                </div>
            </form>
        </div>
    );
}