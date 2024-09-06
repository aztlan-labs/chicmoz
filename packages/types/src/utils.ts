/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {z} from "zod";

// Utility function to recursively apply .partial() to a Zod schema
export function deepPartial(schema: z.ZodType<any, any>): z.ZodType<any, any> {
  if (schema instanceof z.ZodObject) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const shape = schema.shape;
    const newShape: Record<string, z.ZodType<any, any>> = {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    for (const key in shape) newShape[key] = deepPartial(shape[key]);

    return z.object(newShape).partial();
  } else if (schema instanceof z.ZodArray) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return z.array(deepPartial(schema.element));
  } else if (schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return deepPartial(schema._def.innerType).optional();
  } else {
    return schema.optional();
  }
}
