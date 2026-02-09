import React from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

export default function VehicleForm({ initialData, onSubmit, isLoading }) {
  const [formData, setFormData] = React.useState(initialData || {
    brand: "",
    model: "",
    plate_number: "",
    year: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input label="Merk Kendaraan" name="brand" value={formData.brand} onChange={handleChange} placeholder="Contoh: Honda" required />
      <Input label="Model / Tipe" name="model" value={formData.model} onChange={handleChange} placeholder="Contoh: Vario 150" required />
      <Input label="Nomor Polisi" name="plate_number" value={formData.plate_number} onChange={handleChange} placeholder="Contoh: B 1234 ABC" required />
      <Input label="Tahun" name="year" type="number" value={formData.year} onChange={handleChange} placeholder="2022" />
      
      <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
        {isLoading ? "Menyimpan..." : "Simpan Kendaraan"}
      </Button>
    </form>
  );
}