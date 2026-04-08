import { lockService } from "../services/lock.services.js";

export async function create(req, res, next) {
  try {
    const lock = await lockService.createLock(req.body);

    res.status(201).json({lock});
  } catch (err) {
    next(err);
  }
}

export async function getAll(req, res, next) {
  try {
    const filter = {};

    if (req.userRole === "staff") {
      filter.property_id = req.userPropertyId;
    }

    if (req.userRole === "superadmin" && req.query.property_id) {
      filter.property_id = req.query.property_id;
    }

    const locks = await lockService.getLocks(filter);

    res.json({ locks });
  } catch (error) {
    next(error);
  }
}

export async function getOne(req, res, next) {
  try {
    const lock = await lockService.getLock(req.params.id);

    if (!lock) {
      return res.status(404).json({ message: "Lock not found" });
    }

    res.json({ lock });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const lock = await lockService.updateLock(req.params.id, req.body);

    if (!lock) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ lock });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const lock = await lockService.deleteLock(req.params.id);

    if (!lock) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
}