import { useEffect, useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/AuthStore";
import useModalStore from "../store/ModalStore";
import Input from "../components/Input";
import Button from "../components/Button";
import usePropertyStore from "../store/PropertyStore";

const LockForm = ({ data }) => {
  const { activeProperty } = usePropertyStore();
  const { token } = useAuthStore();
  const { closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const isEdit = !!data;

  const [serialNumber, setSerialNumber] = useState("");

  const [error, setError] = useState(null);

  // Prefill form if editing
  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSerialNumber(data.serial_number ?? "");
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!activeProperty?.id) {
      setError("Please select a property before saving the lock.");
      return;
    }

    if (!serialNumber.trim()) {
      setError("Serial number is required.");
      return;
    }

    try {
      const payload = {
        serial_number: serialNumber.trim(),
        property_id: activeProperty.id,
      };

      if (isEdit) {
        await axios.patch(
          `http://localhost:5000/locks/${data.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:5000/locks",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      queryClient.invalidateQueries(["locks"]);
      closeModal();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Error saving lock"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-bold text-center">
        {isEdit ? "Edit Lock" : "Add Lock"}
      </h2>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      <Input
        label="Serial Number"
        type="text"
        name="serialNumber"
        value={serialNumber}
        onChange={(e) => setSerialNumber(e.target.value)}
        placeholder="Enter serial number"
        required
      />

      <div className="flex gap-4 mt-5">
        <Button type="submit">{isEdit ? "Update" : "Add"}</Button>
        <Button type="button" variant="secondary" onClick={closeModal}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default LockForm;