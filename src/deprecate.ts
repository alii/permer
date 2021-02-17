export function deprecate<T extends Function>(alternative: string): MethodDecorator {
  return (instance, name, descriptor) => {
    const original = descriptor.value;

    // @ts-ignore
    descriptor.value = function() {
      const message = `Permer#${name.toString()} is deprecated and will be removed in the future. Please use Permer#${alternative}`;
      console.warn(new Error(message));

      return (original as T | undefined)?.apply(this, arguments);
    };

    return descriptor;
  };
}
