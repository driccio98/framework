declare const Neutralino;

export default class dir
{
    protected static dirs = {
        temp: null,
        data: null,
        documents: null,
        pictures: null,
        music: null,
        video: null,
        downloads: null
    };

    protected static resolvePath(name: string): Promise<string>
    {
        return new Promise(async (resolve) => {
            if (this.dirs[name] === null)
                this.dirs[name] = await Neutralino.os.getPath(name);

            resolve(this.dirs[name]);
        });
    }

    /**
     * System temp directory path
     */
    public static get temp(): Promise<string>
    {
        return new Promise((resolve) => resolve('/tmp'));
    }

    /**
     * System data directory path
     */
    public static get data(): Promise<string>
    {
        return this.resolvePath('data');
    }

    /**
     * System documents directory path
     */
    public static get documents(): Promise<string>
    {
        return this.resolvePath('documents');
    }

    /**
     * System pictures directory path
     */
    public static get pictures(): Promise<string>
    {
        return this.resolvePath('pictures');
    }

    /**
     * System music directory path
     */
    public static get music(): Promise<string>
    {
        return this.resolvePath('music');
    }

    /**
     * System video directory path
     */
    public static get video(): Promise<string>
    {
        return this.resolvePath('video');
    }

    /**
     * System downloads directory path
     */
    public static get downloads(): Promise<string>
    {
        return this.resolvePath('downloads');
    }
};
