import { gl } from '../globals/gl';
import { program } from '../globals/program';
import { GLint, ImageData, WebGLTexture, WebGLUniformLocation } from "../WebGL";

let lastId = -1;

const textureRegistersMap = [
  gl.TEXTURE0,
  gl.TEXTURE1,
  gl.TEXTURE2,
  gl.TEXTURE3,
  gl.TEXTURE4,
  gl.TEXTURE5,
  gl.TEXTURE6,
  gl.TEXTURE7,
  gl.TEXTURE8,
  gl.TEXTURE9,
  gl.TEXTURE10,
  gl.TEXTURE11,
  gl.TEXTURE12,
  gl.TEXTURE13,
  gl.TEXTURE14,
  gl.TEXTURE15,
  gl.TEXTURE16,
  gl.TEXTURE17,
  gl.TEXTURE18,
  gl.TEXTURE19,
  gl.TEXTURE20,
];

export class SpriteGLData {
  textureRegister: u32;
  uniformLocation: WebGLUniformLocation;
  glTexture: WebGLTexture;
  imageData: ImageData
  isReady: boolean;
}

export class SpriteLoader {
  loaded: Map<string, SpriteGLData> = new Map<string, SpriteGLData>();
  pending: Map<string, SpriteGLData> = new Map<string, SpriteGLData>();
  activeSprite: SpriteGLData | null = null;

  activeSprites: Set<SpriteGLData> = new Set<SpriteGLData>();

  get(spriteLocation: string): SpriteGLData | null {
    if (this.loaded.has(spriteLocation)) {
      return this.loaded.get(spriteLocation);
    }

    if (this.pending.has(spriteLocation)) {
      return this.pending.get(spriteLocation);
    }

    return null;
  }

  add(spriteLocation: string): SpriteGLData {
    if (this.loaded.has(spriteLocation)) {
      return this.loaded.get(spriteLocation);
    }

    if (this.pending.has(spriteLocation)) {
      return this.pending.get(spriteLocation);
    }

    lastId++;

    return this.startNewTextureLoading(spriteLocation, lastId);
  }

  update(): void {
    if (this.pending.size === 0) {
      return;
    }

    const keys = this.pending.keys();

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const spriteData = this.pending.get(key);

      if (gl.imageReady(spriteData.imageData) == false) {
        return;
      }

      spriteData.isReady = true;

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, +true);

      gl.activeTexture(spriteData.textureRegister);
      gl.bindTexture(gl.TEXTURE_2D, spriteData.glTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, spriteData.imageData);

      this.loaded.set(key, spriteData);
      this.pending.delete(key);
    }
  }

  useSprite(spriteLocation: string, uniformLocation: GLint): void {
    const spriteData = this.get(spriteLocation);

    if (!spriteData) {
      return; // TODO: throw error
    }

    if (!spriteData.isReady) {
      return; // TODO: throw error
    }

    if (this.activeSprites.has(spriteData)) {
      return;
    }

    gl.uniform1i(uniformLocation, spriteData.imageData);

    gl.activeTexture(spriteData.textureRegister);
    gl.bindTexture(gl.TEXTURE_2D, spriteData.glTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, spriteData.imageData);

    this.activeSprites.add(spriteData);
  }

  private startNewTextureLoading(spriteLocation: string, index: i32): SpriteGLData {
    const spriteData = new SpriteGLData();

    spriteData.imageData = gl.createImage(spriteLocation);
    spriteData.glTexture = gl.createTexture();
    spriteData.textureRegister = textureRegistersMap[index];
    spriteData.isReady = false;

    this.pending.set(spriteLocation, spriteData);

    return spriteData;
  }
}