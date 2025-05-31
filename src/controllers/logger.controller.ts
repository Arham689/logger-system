import type { Context } from "hono";

export const getlogs = (c: Context) => {
    return c.text("llogger callded get from hello test");
};

export const postlogs = (c: Context) => {
    return c.text("llogger callded post from contorllers");
};

export const deletelogs = (c: Context) => {
    const para = c.req.param();
    const qurey = c.req.query();

    console.log(qurey);
    console.log(para.id);
    return c.text(`llogger callded delete from contorllers with ${para.id} `);
};
