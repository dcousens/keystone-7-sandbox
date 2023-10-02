type ListConfiguration = {
}

type Configuration <L extends string> = {
  lists: {
    [key in L]: ListConfiguration
  }
}

export function setup <L extends string = string> (config: Configuration<L>) {
  return true
}
