import { Config } from '@remotion/cli/config';

Config.setEntryPoint('./remotion/index.ts');
Config.setChromiumOpenGlRenderer('angle');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
