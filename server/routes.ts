import { Router } from 'express';
import { LicenseService } from './licenseService';

export const licenseRouter = Router();

/**
 * Health check
 */
licenseRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Kelola Lead Sales - Lifetime License Service',
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/license/activate
 * Body: { licenseKey, deviceId, deviceName, browser, operatingSystem }
 */
licenseRouter.post('/activate', (req, res) => {
  try {
    const { licenseKey, deviceId, deviceName, browser, operatingSystem } = req.body || {};
    const result = LicenseService.activate({
      licenseKey,
      deviceId,
      deviceName,
      browser,
      operatingSystem,
    });

    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      token: result.token,
      license: result.license,
    });
  } catch (error: any) {
    console.error('Error during license activation:', error);
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan pada server saat memproses aktivasi lisensi.',
    });
  }
});

/**
 * POST /api/license/verify
 * Body: { activationToken, deviceId, productCode }
 */
licenseRouter.post('/verify', (req, res) => {
  try {
    const { activationToken, deviceId, productCode } = req.body || {};
    const result = LicenseService.verify({
      activationToken,
      deviceId,
      productCode,
    });

    if (!result.valid) {
      return res.status(result.status).json({
        valid: false,
        error: result.error,
      });
    }

    return res.status(200).json({
      valid: true,
      license: result.license,
    });
  } catch (error: any) {
    console.error('Error during license verification:', error);
    return res.status(500).json({
      valid: false,
      error: 'Terjadi kesalahan pada server saat memverifikasi lisensi.',
    });
  }
});

/**
 * POST /api/license/deactivate
 * Body: { activationToken, deviceId }
 */
licenseRouter.post('/deactivate', (req, res) => {
  try {
    const { activationToken, deviceId } = req.body || {};
    const result = LicenseService.deactivate({
      activationToken,
      deviceId,
    });

    return res.status(result.status).json(result);
  } catch (error: any) {
    console.error('Error during device deactivation:', error);
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan pada server saat melepaskan perangkat.',
    });
  }
});

/**
 * ADMIN ENDPOINTS (For Testing & Management)
 */
licenseRouter.get('/admin/list', (req, res) => {
  try {
    const { search, status } = req.query as { search?: string; status?: string };
    const list = LicenseService.listAll({ search, status });
    return res.json({ success: true, licenses: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

licenseRouter.post('/admin/create', (req, res) => {
  try {
    const { notes } = req.body || {};
    const created = LicenseService.createNewKey(notes);
    return res.json({ success: true, key: created.key, license: created.license });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

licenseRouter.post('/admin/reset-device', (req, res) => {
  try {
    const { licenseId } = req.body || {};
    if (!licenseId) {
      return res.status(400).json({ success: false, error: 'licenseId is required.' });
    }
    const success = LicenseService.resetDeviceByAdmin(licenseId);
    return res.json({ success });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

licenseRouter.post('/admin/status', (req, res) => {
  try {
    const { licenseId, status } = req.body || {};
    if (!licenseId || !status) {
      return res.status(400).json({ success: false, error: 'licenseId and status are required.' });
    }
    const success = LicenseService.updateStatusByAdmin(licenseId, status);
    return res.json({ success });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
