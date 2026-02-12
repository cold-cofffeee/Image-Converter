class ResponseHelper {
  static success(res, data, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message, statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      error: message
    });
  }

  static sendFile(res, filePath, filename, mimeType) {
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.sendFile(filePath);
  }

  static stream(res, stream, filename, mimeType) {
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    stream.pipe(res);
  }
}

module.exports = ResponseHelper;
