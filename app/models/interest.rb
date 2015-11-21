class Interest < ActiveRecord::Base
     validates :screen_name, presence: true,
                    length: { minimum: 3 }
end
