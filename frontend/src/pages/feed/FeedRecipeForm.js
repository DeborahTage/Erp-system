import React, { useState } from 'react';
import { feedApi } from '../../api';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Plus, Trash2, Save, Calculator } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { toast } from 'react-toastify';
import { cn } from '../../lib/utils';

const FeedRecipeForm = () => {
    const [recipe, setRecipe] = useState({
        name: '',
        growthStage: 'Starter',
        proteinPercentage: 18,
        energyKcal: 3000,
        costPerKg: 0,
        ingredients: [{ ingredientName: '', percentage: 0 }]
    });

    const addIngredient = () => {
        setRecipe({ ...recipe, ingredients: [...recipe.ingredients, { ingredientName: '', percentage: 0 }] });
    };

    const removeIngredient = (index) => {
        const newIng = recipe.ingredients.filter((_, i) => i !== index);
        setRecipe({ ...recipe, ingredients: newIng });
    };

    const handleIngredientChange = (index, field, value) => {
        const newIng = [...recipe.ingredients];
        newIng[index][field] = field === 'percentage' ? parseFloat(value) : value;
        setRecipe({ ...recipe, ingredients: newIng });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const totalPct = recipe.ingredients.reduce((sum, i) => sum + i.percentage, 0);
        if (totalPct !== 100) {
            toast.error('Total ingredients must add up to 100%');
            return;
        }
        try {
            await feedApi.createRecipe(recipe);
            toast.success('Recipe formulated successfully');
        } catch (err) {
            toast.error('Formulation failed');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in slide-in-from-bottom duration-500">
            <PageHeader title="Feed Formulation" subtitle="Craft optimized feed recipes with precise nutritional balance and cost control." />

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Recipe Name</Label>
                            <Input
                                className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-lg"
                                placeholder="Broiler Starter Plus"
                                value={recipe.name}
                                onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Protein %</Label>
                                <Input
                                    type="number"
                                    className="h-14 rounded-2xl bg-gray-50 border-none font-bold"
                                    value={recipe.proteinPercentage}
                                    onChange={(e) => setRecipe({ ...recipe, proteinPercentage: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Energy (Kcal)</Label>
                                <Input
                                    type="number"
                                    className="h-14 rounded-2xl bg-gray-50 border-none font-bold"
                                    value={recipe.energyKcal}
                                    onChange={(e) => setRecipe({ ...recipe, energyKcal: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="space-y-4">
                    <div className="flex justify-between items-center px-4">
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Composition Matrix</h2>
                        <button
                            type="button"
                            onClick={addIngredient}
                            className="bg-indigo-50 text-indigo-600 font-bold p-2 px-4 rounded-xl text-xs flex items-center gap-2 hover:bg-indigo-100 transition-colors"
                        >
                            <Plus className="h-4 w-4" /> Add Ingredient
                        </button>
                    </div>

                    <div className="space-y-3">
                        {recipe.ingredients.map((ing, idx) => (
                            <div key={idx} className="flex gap-4 items-end animate-in fade-in slide-in-from-left duration-300">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Maize, Soy Bean, etc."
                                        className="h-14 rounded-2xl bg-white shadow-sm border-none font-bold"
                                        value={ing.ingredientName}
                                        onChange={(e) => handleIngredientChange(idx, 'ingredientName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="w-32">
                                    <Input
                                        type="number"
                                        placeholder="%"
                                        className="h-14 rounded-2xl bg-white shadow-sm border-none font-bold text-center"
                                        value={ing.percentage}
                                        onChange={(e) => handleIngredientChange(idx, 'percentage', e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeIngredient(idx)}
                                    className="h-14 w-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-100 transition-colors"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-gray-400 font-bold flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        <span className={cn(
                            "text-lg",
                            recipe.ingredients.reduce((sum, i) => sum + i.percentage, 0) === 100 ? 'text-emerald-500' : 'text-amber-500'
                        )}>
                            Total: {recipe.ingredients.reduce((sum, i) => sum + i.percentage, 0)}%
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-10 rounded-[2rem] shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Save className="h-5 w-5" /> Save Formulation
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FeedRecipeForm;
