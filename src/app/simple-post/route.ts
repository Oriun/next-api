import { API } from "@/lib";
import { z } from "zod";

const body = z.object({
    name: z.string().min(1).max(100),
})
class Route {
    @API({ body })
    async POST(_request: any, variables: any) {
        const { name } = variables.body as z.infer<typeof body>;
        return { message: 'Nice to meet you ' + name + '!' };
    }
}

export const { POST } = new Route();