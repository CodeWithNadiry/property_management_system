import { useEffect, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import useModalStore from "../store/ModalStore";
import { createProperty, updateProperty } from "../api/property.service";

const PropertyForm = ({ data }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const {closeModal} = useModalStore();
  const isEdit = !!data;

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(data.name || ""); 
    }
  }, [data]);

  const handleChange = (e) => {
    setName(e.target.value); // capture input value
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      const payload = { name };

      if (isEdit) {
        await updateProperty(data.id, payload)
      } else {
        await createProperty(payload)
      }

      window.location.reload(); // reload to see updated list
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold text-center">
        {isEdit ? "Edit Property" : "Add Property"}
      </h2>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Input label="Name" type="text" value={name} onChange={handleChange} />

      <div className="flex gap-4 mt-5 ">
        <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
        <Button onClick={closeModal}>Cancel</Button>
      </div>
    </form>
  );
};

export default PropertyForm;