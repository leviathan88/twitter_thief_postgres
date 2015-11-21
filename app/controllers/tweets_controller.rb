class TweetsController < ApplicationController
   respond_to :html, :json
   
   #grab the user with given id and get user's timeline json
   def index
      @tweets = get_user_tweets(params[:interest_id])
      respond_with(@tweets) do |format|
      format.json { render :json => @tweets.as_json }
      end
   end
        
    private
        #provide id, it'll find user and given it's screen_name it will return timeline
        def get_user_tweets id
            @interest = Interest.find(id)
            client.user_timeline(@interest.screen_name, count: 2000, include_rts: false)
        end
        
        #connect to twitter, thanks to 'twitter' gem, of course we shouldn't be putting secrets here like this :)
        def client
           @client ||= Twitter::REST::Client.new do |config|
              config.consumer_key        = "lXWDYfZtsiN6F8vMPpUGgQNdl"
              config.consumer_secret     = "1D9ng6XQEMy8OCruQzwY9D2hNBSJMvRu16ukmUNeVBMGGyPUWN"
            end
        end
end
