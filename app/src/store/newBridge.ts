/* eslint-disable @typescript-eslint/no-use-before-define */

export default {
    namespaced: true,
    state: () => ({
        params: BridgeParams()
    }),
    mutations: {
        setParam(state: any, payload: any) {
            state.params[payload.key] = payload.value;
        }
    },
    getters: {
        getCoords(state: any) {
            const coords = state.params.coords;
            if (coords != null) {
                return coords.latitude + ", " + coords.longitude;
            } else {
                return null;
            }
        }
    }
}

function BridgeParams() {
    return {
        material: null,
        type: null,
        system: null,
        constructionYear: null,
        lineStreet: null,
        chainage: null,
        coords: null,
        spanLength: null,
        superstructure: null,
        trafficRoutes: null,
        shortDescription: null
    }
}