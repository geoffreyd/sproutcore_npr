# ===========================================================================
# Project:   ScNpr
# Copyright: ©2010 My Company, Inc.
# ===========================================================================

# Add initial buildfile information here
config :all, :required => ['sproutcore','sproutcore/media']
proxy '/npr_api/', :to => 'api.npr.org', :url => '/'