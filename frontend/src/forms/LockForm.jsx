import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useModalStore from "../store/ModalStore";
import Input from "../components/Input";
import Button from "../components/Button";
import usePropertyStore from "../store/PropertyStore";
import { createLock, updateLock } from "../api/locks.service";

const LockForm = ({ data }) => {
  const { activeProperty } = usePropertyStore();
  const { closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const isEdit = !!data;

  const [serialNumber, setSerialNumber] = useState("");

  const [error, setError] = useState(null);

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

    const payload = {
      serial_number: serialNumber.trim(),
      property_id: activeProperty.id,
    };

    try {
      const apiCall = isEdit
        ? () => updateLock(data.id, payload)
        : () => createLock(payload);

      await apiCall();

      queryClient.invalidateQueries(["locks"]);
      closeModal();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Error saving lock";
      setError(message);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-bold text-center">
        {isEdit ? "Edit Lock" : "Add Lock"}
      </h2>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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
