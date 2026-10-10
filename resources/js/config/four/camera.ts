import * as THREE from 'three';

/* ---------------- Данные ---------------- */

const cameraModesStatic = {
    static1: {
        pos: new THREE.Vector3(10, 10, 10),
        angle: new THREE.Vector3(10, 10, 10),
    },
    static2: {
        pos: new THREE.Vector3(-10, 8, -5),
        angle: new THREE.Vector3(10, 10, 10),
    },
};

const cameraModesFollow = {
    follow1: {},
};

/* ---------------- Типы ---------------- */

export type CameraStaticKey = keyof typeof cameraModesStatic
export type CameraFollowKey = keyof typeof cameraModesFollow
export type CameraModeMap = CameraStaticKey | CameraFollowKey

export type CameraStaticPose = typeof cameraModesStatic[CameraStaticKey]
export type CameraFollowPose = typeof cameraModesFollow[CameraFollowKey]

/* ---------------- Объединённая карта ---------------- */

const cameraModes = {
    ...cameraModesStatic,
    ...cameraModesFollow,
};

/* ---------------- Type-safe keys ---------------- */

function typedKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
}

const cameraModesKeys: CameraModeMap[] = [
    ...typedKeys(cameraModesStatic),
    ...typedKeys(cameraModesFollow),
];

/* ---------------- Type guards ---------------- */

function isFollowModeObject(mode: any): mode is CameraFollowPose {
    return !(typeof mode !== 'object' || mode === null);

}

function isStaticModeObject(mode: any): mode is CameraStaticPose {
    if (typeof mode !== 'object' || mode === null) {
        return false;
    }

    return !(!('pos' in mode) || !('angle' in mode));


}

export {
    isFollowModeObject,
    isStaticModeObject,
    cameraModes,
    cameraModesKeys,
    cameraModesStatic,
    cameraModesFollow,
};
