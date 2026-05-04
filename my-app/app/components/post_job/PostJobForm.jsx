import React from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";

export function PostJobForm({ formData, handleChange, handleSubmit, submitting, submitted, error }) {
  const jobTypeOptions = [
    { value: "", label: "Select Protocol" },
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
    { value: "internship", label: "Internship" },
  ];

  const currencyOptions = [
    { value: "USD", label: "USD" },
    { value: "NGN", label: "NGN" },
    { value: "EUR", label: "EUR" },
  ];

  return (
    <div className="glass-card p-1 md:p-1.5 border-glass-border bg-glass-surface/50 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="bg-glass-surface backdrop-blur-3xl rounded-[1.4rem] p-8 md:p-12">
            {submitted && (
                <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 rounded-2xl text-center font-bold animate-in zoom-in-95 duration-300">
                    Transmission Successful! Redirecting to Command Center...
                </div>
            )}
            
            {error && (
                <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-2xl text-center font-bold animate-in zoom-in-95 duration-300">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <Input 
                        label="Position Title"
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange}
                        placeholder="e.g. Senior Systems Architect" 
                        required
                    />
                    <Input 
                        label="Company Identifier"
                        name="company_name" 
                        value={formData.company_name} 
                        onChange={handleChange}
                        placeholder="e.g. GlobalTech Solutions" 
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <Select 
                        label="Contract Protocol"
                        name="job_type" 
                        value={formData.job_type} 
                        onChange={handleChange} 
                        options={jobTypeOptions}
                        required
                    />
                    <Input 
                        label="Spatial Requirement"
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange}
                        placeholder="e.g. Remote (GMT+1 Focus)" 
                    />
                </div>

                <div className="p-8 rounded-2xl bg-glass-surface/30 border border-glass-border ring-1 ring-glass-border space-y-6">
                    <label className="block text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em]">Resource Allocation</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input 
                            type="number" 
                            name="salary_min" 
                            value={formData.salary_min} 
                            onChange={handleChange}
                            placeholder="Min" 
                        />
                        <Input 
                            type="number" 
                            name="salary_max" 
                            value={formData.salary_max} 
                            onChange={handleChange}
                            placeholder="Max" 
                        />
                        <Select 
                            name="salary_currency" 
                            value={formData.salary_currency} 
                            onChange={handleChange}
                            options={currencyOptions}
                        />
                    </div>
                </div>

                <TextArea 
                    label="Requirement Parameters"
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange}
                    required 
                    rows={10} 
                    placeholder="Define the mission, technical stack, and impact..."
                />

                <Button 
                    type="submit" 
                    isLoading={submitting}
                    className="w-full py-6 text-xs uppercase tracking-[0.3em]"
                >
                    Establish Role Transmission
                </Button>
            </form>
        </div>
    </div>
  );
}

