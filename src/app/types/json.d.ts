declare module '*.json' {
    const value: { [key: string]: string | number | boolean | null | object };
    export default value;
}