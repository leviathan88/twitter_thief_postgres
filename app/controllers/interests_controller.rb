class InterestsController < ApplicationController
    before_action :get_interest, except: [:index, :create, :home]
    respond_to :html, :json
    
    def index
        @interest = Interest.all
        respond_with(@interests) do |format|
        format.json { render :json => @interest.as_json }
        format.html
        end
    end
    
    def show
        respond_with(@interest.as_json)
    end
    
    
    def new
       @interest = Interest.new
    end
    
    def edit
        @interest = Interest.find(params[:id])
    end
    
#this create action method was used before angular came into the picture
=begin
    def create
        @interest = Interest.new(interest_params)
        
        if @interest.save
            redirect_to @interest
        else
            render 'new'
        end
    end
=end

    def create
       @interest = Interest.new(interest_params) 
        if @interest.save
            render json: @interest.as_json, status: :ok
        else
            render json: {interest: @interest.errors, status: :no_content}
        end
    end
    
    def update
          if @interest.update_attributes(interest_params)
            render json: @interest.as_json, status: :ok
          else
             render json: {interest: @interest.errors, status: :unprocessable_entity}
          end
    end
    
    
    
    def destroy
         @interest.destroy
         render json: {status: :ok}
    end
    
    def home
    end
    
    
    private
        def interest_params
            params.fetch(:interest, {}).permit(:screen_name, :hashtags, :user_mentions)
        end
      
        def get_interest
            @interest = Interest.find(params[:id])
            render json: {status: :not_found} unless @interest
        end
end
