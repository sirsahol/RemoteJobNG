import React from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";

export function SignupForm({ formData, loading, error, success, onChange, onSubmit }) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Identifier"
          name="username"
          value={formData.username}
          onChange={onChange}
          placeholder="UserHandle"
          required
        />
        <Input
          label="Communication Node"
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="you@domain.com"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Secret Sequence"
          type="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          placeholder="••••••••"
          required
        />
        <Select
          label="Operator Classification"
          name="role"
          value={formData.role}
          onChange={onChange}
          options={[
            { value: "job_seeker", label: "Talent Node" },
            { value: "employer", label: "Organization Entity" },
          ]}
        />
      </div>

      {formData.role === "employer" && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <Input
            label="Entity Title"
            name="company_name"
            value={formData.company_name}
            onChange={onChange}
            placeholder="Acme Global Inc."
          />
        </div>
      )}

      <TextArea
        label="Intelligence Brief"
        name="bio"
        value={formData.bio}
        onChange={onChange}
        rows="3"
        placeholder="Define your technical capability..."
      />

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs font-medium">
          {success}
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        variant="primary"
        className="w-full py-5"
      >
        Initialize Identity
      </Button>
    </form>
  );
}

