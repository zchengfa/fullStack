import { io, Socket, SocketOptions, ManagerOptions } from "socket.io-client";

type EventCallback<T = any> = (data: T) => void;

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;
    private eventListeners: Map<string, EventCallback[]> = new Map();

    // 单例模式确保全局唯一连接
    public static getInstance(url: string, opts?: Partial<ManagerOptions & SocketOptions>): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService(url, opts);
        }
        return SocketService.instance;
    }

    constructor(url: string, opts?: Partial<ManagerOptions & SocketOptions>) {
        this.socket = io(url, {
            autoConnect: false, // 手动控制连接时机
            transports: ["websocket"], // 强制使用WebSocket协议
            ...opts,
        });
        this.initGlobalListeners();
    }

    // 初始化全局事件监听（连接状态）
    private initGlobalListeners() {
        this.socket?.on("connect", () => {
            console.log("Socket connected:", this.socket?.id);
        });

        this.socket?.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });
    }

    // 建立连接
    public connect() {
        if (!this.socket?.connected) {
            this.socket?.connect();
        }
    }

    // 订阅事件（自动管理监听器）
    public on<T>(event: string, callback: EventCallback<T>) {
        const listeners = this.eventListeners.get(event) || [];
        listeners.push(callback);
        this.eventListeners.set(event, listeners);

        this.socket?.on(event, callback);
    }

    // 取消订阅
    public off(event: string, callback?: EventCallback) {
        if (callback) {
            const listeners = this.eventListeners.get(event)?.filter(fn => fn !== callback);
            this.eventListeners.set(event, listeners || []);
            this.socket?.off(event, callback);
        } else {
            this.eventListeners.delete(event);
            this.socket?.off(event);
        }
    }

    // 发送事件（支持泛型约束
    public emit<T>(event: string, payload?: T) {
        this.socket?.emit(event, payload);
    }

    // 断开连接
    public disconnect() {
        this.socket?.disconnect();
        this.eventListeners.clear();
    }
}

export default SocketService;
