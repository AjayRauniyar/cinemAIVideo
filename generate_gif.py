import sys
import torch
from diffusers import AnimateDiffPipeline, LCMScheduler, MotionAdapter
from diffusers.utils import export_to_gif

def generate_gif(prompt):
    adapter = MotionAdapter.from_pretrained("wangfuyun/AnimateLCM", torch_dtype=torch.float16)
    pipe = AnimateDiffPipeline.from_pretrained("emilianJR/epiCRealism", motion_adapter=adapter, torch_dtype=torch.float16)
    pipe.scheduler = LCMScheduler.from_config(pipe.scheduler.config, beta_schedule="linear")

    pipe.load_lora_weights("wangfuyun/AnimateLCM", weight_name="AnimateLCM_sd15_t2v_lora.safetensors", adapter_name="lcm-lora")
    pipe.set_adapters(["lcm-lora"], [0.8])

    pipe.enable_vae_slicing()
    pipe.enable_model_cpu_offload()

    output = pipe(
        prompt=prompt,
        negative_prompt="bad quality, worse quality, low resolution",
        num_frames=16,
        guidance_scale=2.0,
        num_inference_steps=8,
        generator=torch.Generator("cpu").manual_seed(0),
    )
    frames = output.frames[0]
    export_to_gif(frames, "animatelcm.gif")

if __name__ == "__main__":
    # Accept prompt as command-line argument
    if len(sys.argv) != 2:
        print("Usage: python generate_gif.py <prompt>")
        sys.exit(1)
    
    prompt = sys.argv[1]
    generate_gif(prompt)
