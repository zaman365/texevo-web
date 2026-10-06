import { defineCloudflareConfig } from '@opennextjs/cloudflare'

const config = defineCloudflareConfig()
// Payload's migration dependencies include Turbopack-generated external names
// that the Workers bundler cannot resolve. Keep the normal local Next build;
// use its supported webpack build for this deployment adapter.
config.buildCommand = 'pnpm exec next build --webpack'
export default config
