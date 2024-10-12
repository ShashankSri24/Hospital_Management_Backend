export const catchAsyncErrors = (catchAsync) => {
    return (req, res, next) => {
      Promise.resolve(catchAsync(req, res, next)).catch(next);
    };
  };