# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :shut_up,
  ecto_repos: [ShutUp.Repo]

# Configures the endpoint
config :shut_up, ShutUp.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "epudUJjEvU4CllVchTeHcAkujjiad9+HUZMrCxGl0CiiNWTkPVJj+9HffYXA6aJa",
  render_errors: [view: ShutUp.ErrorView, accepts: ~w(html json)],
  pubsub: [name: ShutUp.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
