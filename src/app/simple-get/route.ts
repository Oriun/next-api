import { API } from "@/lib";

class Route {
    @API()
    async GET() {
        return { message: 'Hello world!' };
    }
}

export const { GET } = new Route();