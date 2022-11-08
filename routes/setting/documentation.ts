import { Next, ParameterizedContext } from "koa";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class SettingDocumentationController {
  public static async get(ctx: ParameterizedContext, next: Next) {
    const {
      code = "",
      name = "",
      job_id,
      status,
      limit,
      offset,
    }: {
      code?: string;
      name?: string;
      job_id?: number;
      status?: string;
      limit?: number;
      offset?: number;
    } = ctx.query;

    const result = await prisma.documentation.findMany({
      where: {
        ...(code && { code: { contains: code } }),
        ...(name && { name: { contains: name } }),
        ...(job_id && { job_id: job_id }),
        ...(status && { status: status }),
      },
      ...(limit && { take: +limit }),
      ...(offset && { skip: +offset }),
    });

    return (ctx.body = { success: true, data: result });
  }

  public static async create(ctx: ParameterizedContext, next: Next) {
    try {
      const {
        code = "",
        name = "",
        job_id = 0,
        birth_date = "",
        money = 0,
        hobbies = [],
        description,
        status = "active",
      }: {
        code?: string;
        name?: string;
        job_id?: number;
        birth_date?: string;
        money?: number;
        hobbies?: string[];
        description?: string;
        status?: string;
      } = JSON.parse(JSON.stringify(ctx.request.body));

      if (job_id == 0) ctx.throw("Job required", 400);

      const result = await prisma.documentation.create({
        data: {
          name: name,
          code: code,
          job_id: +job_id,
          birth_date,
          money: +money,
          hobbies: hobbies,
          description,
          status,
        },
      });

      return (ctx.body = {
        success: true,
        data: result,
        message: "Berhasil membuat Dokumentasi dengan nama " + name,
      });
    } catch (error: any) {
      ctx.status = error.statusCode || error.status || 500;
      return (ctx.body = {
        success: false,
        message: error.message,
      });
    }
  }

  public static async update(ctx: ParameterizedContext, next: Next) {
    try {
      const { id = 0 }: { id?: number } = ctx.params;
      const {
        code = "",
        name = "",
        job_id = 0,
        birth_date = "",
        money = 0,
        hobbies = [],
        description,
        status = "active",
      }: {
        code?: string;
        name?: string;
        job_id?: number;
        birth_date?: string;
        money?: number;
        hobbies?: string[];
        description?: string;
        status?: string;
      } = JSON.parse(JSON.stringify(ctx.request.body));

      if (job_id == 0) ctx.throw("Job required", 400);

      const result = await prisma.documentation.update({
        where: { id: +id },
        data: {
          name: name,
          code: code,
          job_id: +job_id,
          birth_date,
          money: +money,
          hobbies: hobbies,
          description,
          status,
        },
      });

      return (ctx.body = {
        success: true,
        data: result,
        message: "Berhasil membuat Dokumentasi dengan nama " + name,
      });
    } catch (error: any) {
      ctx.status = error.statusCode || error.status || 500;
      return (ctx.body = {
        success: false,
        message: error.message,
      });
    }
  }

  public static async delete(ctx: ParameterizedContext, next: Next) {
    try {
      const { id = 0 }: { id?: number } = ctx.params;
      if (id == 0) ctx.throw("ID is required", 400);
      const result = await prisma.documentation.delete({
        where: { id: +id },
      });

      ctx.status = 200;
      return (ctx.body = {
        success: true,
        message: "Berhasil menghapus Dokumentasi",
        data: result,
      });
    } catch (error: any) {
      ctx.status = error.statusCode || error.status || 500;
      return (ctx.body = {
        success: false,
        message: error.message,
      });
    }
  }
}
