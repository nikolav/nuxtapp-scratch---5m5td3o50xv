interface ISocketEventHandler<T = any> {
  (...args: T[]): void;
}

export const useIOEvent = <T = any>(
  EVENT: any,
  handle: ISocketEventHandler<T>
) => {
  const e = toValue(EVENT);
  if (!e) return;
  const { $socket } = useNuxtApp();
  onUnmounted(() => $socket?.off(e, handle));
  $socket?.on(e, handle);
};
